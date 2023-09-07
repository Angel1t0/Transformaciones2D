// ********** Inicialización **********
// Obtiene elementos del DOM
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d'); // Obtenemos el contexto del canvas para poder dibujar
let verticesOriginal = []; // Vértices escritos por el usuario 

// Botones
const buttonDibujar = document.getElementById('button-dibujar');
const buttonTraslacion = document.getElementById('button-traslacion');
const buttonEscalamiento = document.getElementById('button-escalamiento');
const buttonRotacion = document.getElementById('button-rotacion');
const buttonSesgado = document.getElementById('button-sesgado');
const buttonCombinar = document.getElementById('button-combinar');
const buttonLimpiar = document.getElementById('button-limpiar');

// Opciones a combinar
const optionTraslacion = document.getElementById('option-traslacion');
const optionEscalamiento = document.getElementById('option-escalamiento');
const optionRotacion = document.getElementById('option-rotacion');
const optionSesgado = document.getElementById('option-sesgado');


// ********** Funciones de Utilidad **********
// Dibuja el plano cartesiano en el canvas
const llenarCanvas = () => {
    ctx.font = '8px Arial';
    ctx.moveTo(310, 10);
    ctx.lineTo(310, 610);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(10, 310);
    ctx.lineTo(610, 310);
    ctx.stroke();

    let xNum = -30;
    let yNum = 30;
    for (let i = 10; i <= 610; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 307);
        ctx.lineTo(i, 313);
        ctx.stroke();

        ctx.strokeText(xNum, i, 325);
        xNum += 2;

        ctx.beginPath();
        ctx.moveTo(307, i);
        ctx.lineTo(313, i);
        ctx.stroke();
        ctx.strokeText(yNum, 320, i);
        yNum -= 2;
    }
};

// Elimina espacios y paréntesis de la cadena de vértices
const eliminarEspacios = (vertices) => {
    vertices = vertices.replace(/[() ]/g, ""); // Usamos una expresión regular para eliminar espacios y paréntesis
    return vertices;
};

// Convierte coordenadas a píxeles en el canvas
const convertirPx = (vertices) => {
    const verticesAux = [];
    vertices.filter((vertice, index) => {
        if (vertice <= 0) {
            if (index % 2 !== 0) {
                verticesAux.push((15 + (vertice / 2) * -1) * 20 + 10);
            } else {
                verticesAux.push((15 + (vertice / 2)) * 20 + 10);
            }
        } else {
            if (index % 2 === 0) {
                verticesAux.push((15 + (vertice / 2)) * 20 + 10);
            } else {
                verticesAux.push((15 + (vertice / 2 * -1)) * 20 + 10);
            }
        }
    });
    return verticesAux;
};


// ********** Funciones de Dibujo **********
// Dibuja un polígono con las coordenadas dadas
const dibujarPoligono = (coordenadas) => {
    ctx.beginPath();  // Comienza un nuevo camino.
    for (let index = 0; index < coordenadas.length; index += 2) {
        if (index === coordenadas.length - 2) {
            ctx.moveTo(coordenadas[index], coordenadas[index + 1]);
            ctx.lineTo(coordenadas[0], coordenadas[1]);
        } else {
            ctx.moveTo(coordenadas[index], coordenadas[index + 1]);
            ctx.lineTo(coordenadas[index + 2], coordenadas[index + 3]);
        }
    }
    ctx.stroke();  // Dibuja el camino.
};

// Limpia el polígono del canvas y dibuja el plano cartesiano de nuevo
const limpiarPoligono = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    llenarCanvas();
};

// ********** Funciones de Transformación **********
// Traslada un polígono
const traslacion = (vertices, dx, dy) => {
    let verticesTraslacion = [];
    vertices.filter((vertice, index) => {
        if (index % 2 === 0) {
            verticesTraslacion.push(parseFloat(vertice) + dx);
        } else {
            verticesTraslacion.push(parseFloat(vertice) + dy);
        }
    });
    return verticesTraslacion;
};

// Escala un polígono
const escalamiento = (vertices, sx, sy) => {
    let verticesEscalamiento = [];
    vertices.filter((vertice, index) => {
        if (index % 2 === 0) {
            verticesEscalamiento.push(vertice * sx);
        } else {
            verticesEscalamiento.push(vertice * sy);
        }
    });
    return verticesEscalamiento;
};

// Rota un polígono
const rotacion = (vertices, angulo) => {
    let verticesRotacion = [];
    const anguloRadians = angulo * Math.PI / 180;
    vertices.filter((vertice, index) => {
        if (index % 2 === 0) {
            verticesRotacion.push(vertice * Math.cos(anguloRadians) - vertices[index + 1] * Math.sin(anguloRadians));
        } else {
            verticesRotacion.push(vertices[index - 1] * Math.sin(anguloRadians) + vertice * Math.cos(anguloRadians));
        }
    });
    return verticesRotacion;
};

// Sesga un polígono
const sesgado = (vertices, shx, shy) => {
    let verticesSesgado = [];
    vertices.filter((vertice, index) => {
        if (index % 2 === 0) {
            verticesSesgado.push(parseFloat(vertice) + vertices[index + 1] * shx);
        } else {
            verticesSesgado.push(parseFloat(vertice) + vertices[index - 1] * shy);
        }
    });
    return verticesSesgado;
};

// ********** Funciones de Validación **********
// Valida si un input es numérico y no está vacío
const validateInput = (input) => input !== "" && !isNaN(input);

// Valida y dibuja una transformación si los inputs son válidos
const validateInputText = (func, vertice, input1, input2) => {
    if (validateInput(input1.value) && validateInput(input2.value)) {
        dibujarPoligono(convertirPx(func(vertice, parseFloat(input1.value), parseFloat(input2.value))));
        limpiarPoligono();
    } else {
        alert(`Debe llenar los campos correspondientes para realizar el/la ${func.name}.`);
    }
}


// ********** Eventos **********
// Dibuja el polígono original cuando se hace clic en "Dibujar"
buttonDibujar.addEventListener('click', () => {
    let vertices = document.getElementById('vertices').value; // (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)
    vertices = eliminarEspacios(vertices);

    const coordenadas = convertirPx(vertices.split(','));
    verticesOriginal = vertices.split(',');
    dibujarPoligono(coordenadas);
    limpiarPoligono();
});

buttonTraslacion.addEventListener('click', () => {
    let dx = document.getElementById('dx');
    let dy = document.getElementById('dy');

    validateInputText(traslacion, verticesOriginal, dx, dy);
});

buttonEscalamiento.addEventListener('click', () => {
    let sx = document.getElementById('sx');
    let sy = document.getElementById('sy');

    validateInputText(escalamiento, verticesOriginal, sx, sy);
});

buttonRotacion.addEventListener('click', () => {
    let angulo = document.getElementById('angulo');

    if (validateInput(angulo.value)) {
        dibujarPoligono(convertirPx(rotacion(verticesOriginal, parseFloat(angulo.value))));
        limpiarPoligono();
    } else {
        alert('Debe llenar los campos correspondientes para realizar la rotación.');
    }

});

buttonSesgado.addEventListener('click', () => {
    let shx = document.getElementById('shx');
    let shy = document.getElementById('shy');

    validateInputText(sesgado, verticesOriginal, shx, shy);
});

buttonCombinar.addEventListener('click', () => {
    let verticesTransformados = [...verticesOriginal]; // Copia de los vértices originales sin afectarlos

    if (optionTraslacion.checked) {
        let dx = parseFloat(document.getElementById('dx').value);
        let dy = parseFloat(document.getElementById('dy').value);

        if (validateInput(dx) && validateInput(dy)) {
            verticesTransformados = traslacion(verticesTransformados, dx, dy);
        } else {
            alert('Debe llenar los campos correspondientes para realizar la traslación.');
        }
    }

    if (optionEscalamiento.checked) {
        let sx = parseFloat(document.getElementById('sx').value);
        let sy = parseFloat(document.getElementById('sy').value);

        if (validateInput(sx) && validateInput(sy)) {
            verticesTransformados = escalamiento(verticesTransformados, sx, sy);
        } else {
            alert('Debe llenar los campos correspondientes para realizar el escalamiento.');
        }
    }

    if (optionRotacion.checked) {
        let angulo = parseFloat(document.getElementById('angulo').value);

        if (validateInput(angulo)) {
            verticesTransformados = rotacion(verticesTransformados, angulo);
        } else {
            alert('Debe llenar los campos correspondientes para realizar la rotación.');
        }
    }

    if (optionSesgado.checked) {
        let shx = parseFloat(document.getElementById('shx').value);
        let shy = parseFloat(document.getElementById('shy').value);

        if (validateInput(shx) && validateInput(shy)) {
        verticesTransformados = sesgado(verticesTransformados, shx, shy);
        } else {
            alert('Debe llenar los campos correspondientes para realizar el sesgado.');
        }
    }

    // window.alert('Polígono combinado: ' + verticesTransformados);
    dibujarPoligono(convertirPx(verticesTransformados));
    limpiarPoligono(); // Limpia el canvas y dibuja el polígono transformado
});

// Regresa todo a su estado inicial
buttonLimpiar.addEventListener('click', () => {
    limpiarPoligono();
    document.getElementById('vertices').value = '';
    document.getElementById('dx').value = '';
    document.getElementById('dy').value = '';
    document.getElementById('sx').value = '';
    document.getElementById('sy').value = '';
    document.getElementById('angulo').value = '';
    document.getElementById('shx').value = '';
    document.getElementById('shy').value = '';
    document.getElementById('option-traslacion').checked = false;
    document.getElementById('option-escalamiento').checked = false;
    document.getElementById('option-rotacion').checked = false;
    document.getElementById('option-sesgado').checked = false;
});

// ********** Inicio del programa **********
// Llena el canvas con el plano cartesiano al cargar la página
llenarCanvas();