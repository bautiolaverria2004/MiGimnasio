// ==========================================
// MIGIMNASIO - VERSIÓN 2
// Mi rutina → Días → Ejercicios → Historial
// ==========================================

// Usamos una clave nueva para guardar los datos.
// Así, las pruebas anteriores no aparecen
// en la nueva organización.

const CLAVE = "migimnasio_v2";

const main = document.querySelector("main");

// Ocultamos las pantallas anteriores.
// La nueva interfaz se crea desde JavaScript.

Array.from(main.children).forEach(elemento => {
    elemento.hidden = true;
});

// Creamos el contenedor principal.

const aplicacion = document.createElement("div");
aplicacion.id = "aplicacionGimnasio";

main.appendChild(aplicacion);


// ==========================================
// DATOS
// ==========================================

let datos;

try {
    datos = JSON.parse(localStorage.getItem(CLAVE));
} catch (error) {
    datos = null;
}

if (!datos || !Array.isArray(datos.dias)) {
    datos = {
        nombre: "Mi rutina",
        dias: []
    };
}

// Variables para recordar dónde estamos.

let diaActual = null;
let ejercicioActual = null;
let seriesActuales = [];


// ==========================================
// GUARDAR DATOS
// ==========================================

function guardarDatos() {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(datos));
        return true;
    } catch (error) {
        alert("No se pudieron guardar los cambios.");
        return false;
    }
}


// ==========================================
// FUNCIONES PARA CREAR ELEMENTOS
// ==========================================

function crearElemento(tipo, texto, padre) {
    const elemento = document.createElement(tipo);

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    if (padre) {
        padre.appendChild(elemento);
    }

    return elemento;
}

function crearBoton(texto, accion, padre, peligro = false) {
    const boton = crearElemento("button", texto, padre);

    boton.type = "button";
    boton.addEventListener("click", accion);

    if (peligro) {
        boton.style.backgroundColor = "#dc2626";
    }

    return boton;
}

function crearTarjeta(padre) {
    const tarjeta = document.createElement("div");

    tarjeta.style.cssText = `
        padding: 15px;
        margin: 12px 0;
        border-radius: 10px;
        background: #f1f5f9;
    `;

    padre.appendChild(tarjeta);

    return tarjeta;
}

function limpiarPantalla() {
    aplicacion.replaceChildren();
}

function obtenerDia() {
    return datos.dias[diaActual];
}

function obtenerEjercicio() {
    return obtenerDia().ejercicios[ejercicioActual];
}

function formatearFecha(fecha) {
    const valor = new Date(fecha);

    return Number.isNaN(valor.getTime())
        ? "Fecha desconocida"
        : valor.toLocaleString("es-AR");
}


// ==========================================
// PANTALLA PRINCIPAL
// ==========================================

function mostrarInicio() {
    limpiarPantalla();

    crearElemento(
        "h2",
        "Tu espacio de entrenamiento",
        aplicacion
    );

    const tarjeta = crearTarjeta(aplicacion);

    crearElemento("h3", "📁 " + datos.nombre, tarjeta);

    crearElemento(
        "p",
        `${datos.dias.length} días de entrenamiento`,
        tarjeta
    );

    crearBoton(
        "Abrir mi rutina →",
        mostrarDias,
        tarjeta
    );

    mostrarPanelProgreso();
}
    // Espacio reservado para futuros gráficos.

    const progreso = crearTarjeta(aplicacion);

    crearElemento("h3", "📈 Mi progreso", progreso);

    crearElemento(
        "p",
        "Próximamente vas a poder consultar " +
        "gráficos de fuerza y volumen de entrenamiento.",
        progreso
    );

// ==========================================
// PANTALLA DE DÍAS
// ==========================================

function mostrarDias() {
    limpiarPantalla();

    crearBoton(
        "← Inicio",
        mostrarInicio,
        aplicacion
    );

    crearElemento("h2", datos.nombre, aplicacion);

    crearBoton(
        "+ Agregar día",
        agregarDia,
        aplicacion
    );

    if (datos.dias.length === 0) {
        crearElemento(
            "p",
            "Todavía no tenés días cargados. " +
            "Podés empezar agregando Torso 1.",
            aplicacion
        );
    }

    datos.dias.forEach((dia, indice) => {
        const tarjeta = crearTarjeta(aplicacion);

        crearElemento("h3", dia.nombre, tarjeta);

        crearElemento(
            "p",
            `${dia.ejercicios.length} ejercicios`,
            tarjeta
        );

        crearBoton(
            "Abrir",
            () => {
                diaActual = indice;
                mostrarEjercicios();
            },
            tarjeta
        );

        crearBoton(
            "Renombrar",
            () => renombrarDia(indice),
            tarjeta
        );

        crearBoton(
            "Eliminar",
            () => eliminarDia(indice),
            tarjeta,
            true
        );
    });
}


// ==========================================
// AGREGAR DÍA
// ==========================================

function agregarDia() {
    const nombre = prompt(
        "¿Cómo se llama el día de entrenamiento?\n" +
        "Ejemplo: Torso 1"
    )?.trim();

    if (!nombre) return;

    datos.dias.push({
        nombre: nombre,
        ejercicios: []
    });

    if (!guardarDatos()) {
        datos.dias.pop();
        return;
    }

    mostrarDias();
}


// ==========================================
// RENOMBRAR DÍA
// ==========================================

function renombrarDia(indice) {
    const dia = datos.dias[indice];

    const nuevoNombre = prompt(
        "Nuevo nombre del día:",
        dia.nombre
    )?.trim();

    if (!nuevoNombre) return;

    const anterior = dia.nombre;

    dia.nombre = nuevoNombre;

    if (!guardarDatos()) {
        dia.nombre = anterior;
        return;
    }

    mostrarDias();
}


// ==========================================
// ELIMINAR DÍA
// ==========================================

function eliminarDia(indice) {
    const dia = datos.dias[indice];

    const confirmar = confirm(
        `¿Eliminar "${dia.nombre}"?\n\n` +
        "También se eliminarán sus ejercicios " +
        "y todos sus entrenamientos."
    );

    if (!confirmar) return;

    const eliminado = datos.dias.splice(indice, 1)[0];

    if (!guardarDatos()) {
        datos.dias.splice(indice, 0, eliminado);
        return;
    }

    mostrarDias();
}


// ==========================================
// PANTALLA DE EJERCICIOS
// ==========================================

function mostrarEjercicios() {
    limpiarPantalla();

    crearBoton(
        "← Volver a mi rutina",
        mostrarDias,
        aplicacion
    );

    const dia = obtenerDia();

    crearElemento("h2", dia.nombre, aplicacion);

    crearBoton(
        "+ Agregar ejercicio",
        agregarEjercicio,
        aplicacion
    );

    if (dia.ejercicios.length === 0) {
        crearElemento(
            "p",
            "Todavía no agregaste ejercicios.",
            aplicacion
        );
    }

    dia.ejercicios.forEach((ejercicio, indice) => {
        const tarjeta = crearTarjeta(aplicacion);

        crearElemento("h3", ejercicio.nombre, tarjeta);

        crearElemento(
            "p",
            `${ejercicio.entrenamientos.length} entrenamientos guardados`,
            tarjeta
        );

        crearBoton(
            "Abrir",
            () => {
                ejercicioActual = indice;
                abrirEjercicio();
            },
            tarjeta
        );

        crearBoton(
            "Eliminar",
            () => eliminarEjercicio(indice),
            tarjeta,
            true
        );
    });
}


// ==========================================
// AGREGAR EJERCICIO
// ==========================================

function agregarEjercicio() {
    const nombre = prompt(
        "Nombre del ejercicio:"
    )?.trim();

    if (!nombre) return;

    const ejercicios = obtenerDia().ejercicios;

    ejercicios.push({
        nombre: nombre,
        entrenamientos: []
    });

    if (!guardarDatos()) {
        ejercicios.pop();
        return;
    }

    mostrarEjercicios();
}


// ==========================================
// ELIMINAR EJERCICIO
// ==========================================

function eliminarEjercicio(indice) {
    const ejercicios = obtenerDia().ejercicios;

    const ejercicio = ejercicios[indice];

    if (!confirm(
        `¿Eliminar "${ejercicio.nombre}" y su historial?`
    )) {
        return;
    }

    const eliminado = ejercicios.splice(indice, 1)[0];

    if (!guardarDatos()) {
        ejercicios.splice(indice, 0, eliminado);
        return;
    }

    mostrarEjercicios();
}


// ==========================================
// ABRIR EJERCICIO
// ==========================================

function abrirEjercicio() {
    const ejercicio = obtenerEjercicio();

    const ultimo = ejercicio.entrenamientos.at(-1);

    if (ultimo && Array.isArray(ultimo.series)) {
        seriesActuales = ultimo.series.map(serie => ({
            peso: Number(serie.peso),
            repeticiones: Number(serie.repeticiones)
        }));
    } else {
        seriesActuales = [{
            peso: 0,
            repeticiones: 0
        }];
    }

    mostrarPantallaEjercicio();
}


// ==========================================
// PANTALLA DE SERIES
// ==========================================

function mostrarPantallaEjercicio() {
    limpiarPantalla();

    crearBoton(
        "← Volver a ejercicios",
        mostrarEjercicios,
        aplicacion
    );

    const ejercicio = obtenerEjercicio();

    crearElemento("h2", ejercicio.nombre, aplicacion);

    const ultimo = ejercicio.entrenamientos.at(-1);

    crearElemento(
        "p",
        ultimo
            ? "Último entrenamiento: " +
              formatearFecha(ultimo.fecha)
            : "Todavía no hay entrenamientos guardados.",
        aplicacion
    );

    // Selector de incremento de peso.

    const etiquetaSalto = crearElemento(
        "label",
        "Salto de peso (kg): ",
        aplicacion
    );

    const saltoPeso = document.createElement("select");
    saltoPeso.id = "saltoPeso";

    [0.5, 1, 2.5, 5].forEach(valor => {
        const opcion = document.createElement("option");

        opcion.value = valor;
        opcion.textContent = valor;

        if (valor === 2.5) {
            opcion.selected = true;
        }

        saltoPeso.appendChild(opcion);
    });

    etiquetaSalto.appendChild(saltoPeso);

    const lista = crearElemento(
        "div",
        undefined,
        aplicacion
    );

    // Mostrar series.

    seriesActuales.forEach((serie, indice) => {
        const tarjeta = crearTarjeta(lista);

        crearElemento(
            "h3",
            `Serie ${indice + 1}`,
            tarjeta
        );

        crearControl(
            tarjeta,
            serie,
            "peso",
            "Peso (kg)"
        );

        crearControl(
            tarjeta,
            serie,
            "repeticiones",
            "Repeticiones"
        );

        crearBoton(
            "Eliminar serie",
            () => {
                seriesActuales.splice(indice, 1);
                mostrarPantallaEjercicio();
            },
            tarjeta,
            true
        );
    });

    crearBoton(
        "+ Agregar serie",
        agregarSerie,
        aplicacion
    );

    crearBoton(
        "Guardar entrenamiento",
        guardarEntrenamiento,
        aplicacion
    );

    crearElemento("h3", "Historial", aplicacion);

    mostrarHistorial();
}


// ==========================================
// CONTROLES DE PESO Y REPETICIONES
// ==========================================

function crearControl(padre, serie, propiedad, titulo) {
    const grupo = crearElemento(
        "div",
        undefined,
        padre
    );

    grupo.style.margin = "10px 0";

    crearElemento("span", titulo + ": ", grupo);

    const input = document.createElement("input");

    input.type = "number";
    input.min = "0";
    input.step = propiedad === "peso" ? "any" : "1";
    input.value = serie[propiedad];

    input.style.cssText = `
        width: 75px;
        padding: 8px;
        margin: 0 8px;
    `;

    grupo.appendChild(input);

    input.addEventListener("change", () => {
        const valor = Number(input.value);

        const valido =
            input.value.trim() !== "" &&
            Number.isFinite(valor) &&
            valor >= 0 &&
            (
                propiedad === "peso" ||
                Number.isInteger(valor)
            );

        if (valido) {
            serie[propiedad] = valor;
        } else {
            input.value = serie[propiedad];
        }
    });

    function modificar(direccion) {
        const salto = propiedad === "peso"
            ? Number(document.getElementById("saltoPeso").value)
            : 1;

        const nuevo = serie[propiedad] + direccion * salto;

        serie[propiedad] = Math.max(
            0,
            Math.round(nuevo * 100) / 100
        );

        input.value = serie[propiedad];
    }

    crearBoton(
        "−",
        () => modificar(-1),
        grupo
    );

    crearBoton(
        "+",
        () => modificar(1),
        grupo
    );
}


// ==========================================
// AGREGAR SERIE
// ==========================================

function agregarSerie() {
    const ultima = seriesActuales.at(-1);

    seriesActuales.push(
        ultima
            ? { ...ultima }
            : { peso: 0, repeticiones: 0 }
    );

    mostrarPantallaEjercicio();
}


// ==========================================
// GUARDAR ENTRENAMIENTO
// ==========================================

function guardarEntrenamiento() {
    if (seriesActuales.length === 0) {
        alert("Agregá al menos una serie.");
        return;
    }

    if (!confirm("¿Guardar este entrenamiento?")) {
        return;
    }

    const ejercicio = obtenerEjercicio();

    ejercicio.entrenamientos.push({
        fecha: new Date().toISOString(),

        series: seriesActuales.map(serie => ({
            peso: serie.peso,
            repeticiones: serie.repeticiones
        }))
    });

    if (!guardarDatos()) {
        ejercicio.entrenamientos.pop();
        return;
    }

    mostrarPantallaEjercicio();

    alert("Entrenamiento guardado.");
}


// ==========================================
// HISTORIAL
// ==========================================

function mostrarHistorial() {
    const ejercicio = obtenerEjercicio();

    if (ejercicio.entrenamientos.length === 0) {
        crearElemento(
            "p",
            "Todavía no hay entrenamientos registrados.",
            aplicacion
        );

        return;
    }

    for (
        let indice = ejercicio.entrenamientos.length - 1;
        indice >= 0;
        indice--
    ) {
        const entrenamiento = ejercicio.entrenamientos[indice];

        const tarjeta = crearTarjeta(aplicacion);

        crearElemento(
            "strong",
            formatearFecha(entrenamiento.fecha),
            tarjeta
        );

        entrenamiento.series.forEach((serie, numero) => {
            crearElemento(
                "p",
                `Serie ${numero + 1}: ` +
                `${serie.peso} kg × ` +
                `${serie.repeticiones} repeticiones`,
                tarjeta
            );
        });

        crearBoton(
            "Eliminar entrenamiento",
            () => eliminarEntrenamiento(indice),
            tarjeta,
            true
        );
    }
}


// ==========================================
// ELIMINAR ENTRENAMIENTO
// ==========================================

function eliminarEntrenamiento(indice) {
    const ejercicio = obtenerEjercicio();

    const entrenamiento = ejercicio.entrenamientos[indice];

    if (!confirm(
        "¿Eliminar el entrenamiento del " +
        formatearFecha(entrenamiento.fecha) +
        "?"
    )) {
        return;
    }

    const eliminado = ejercicio.entrenamientos.splice(
        indice,
        1
    )[0];

    if (!guardarDatos()) {
        ejercicio.entrenamientos.splice(
            indice,
            0,
            eliminado
        );

        return;
    }

    mostrarPantallaEjercicio();
}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

mostrarInicio();
// ==========================================
// GRÁFICOS DE PROGRESO
// ==========================================

// Obtener todos los ejercicios y sus entrenamientos.

function obtenerEjerciciosConHistorial() {
    const ejercicios = [];

    datos.dias.forEach(dia => {
        dia.ejercicios.forEach(ejercicio => {
            if (ejercicio.entrenamientos.length > 0) {
                ejercicios.push({
                    dia: dia.nombre,
                    nombre: ejercicio.nombre,
                    entrenamientos: ejercicio.entrenamientos
                });
            }
        });
    });

    return ejercicios;
}


// ==========================================
// PANEL PRINCIPAL DE PROGRESO
// ==========================================

function mostrarPanelProgreso() {
    const panel = crearTarjeta(aplicacion);

    crearElemento("h3", "📈 Mi progreso", panel);

    const ejercicios = obtenerEjerciciosConHistorial();

    if (ejercicios.length === 0) {
        crearElemento(
            "p",
            "Guardá tu primer entrenamiento para empezar a ver tus gráficos.",
            panel
        );

        return;
    }

    crearElemento(
        "h4",
        "Evolución del peso máximo",
        panel
    );

    const selector = document.createElement("select");

    selector.style.cssText = `
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
    `;

    ejercicios.forEach((ejercicio, indice) => {
        const opcion = document.createElement("option");

        opcion.value = indice;
        opcion.textContent =
            `${ejercicio.nombre} (${ejercicio.dia})`;

        selector.appendChild(opcion);
    });

    panel.appendChild(selector);

    const contenedorFuerza = document.createElement("div");
    panel.appendChild(contenedorFuerza);

    function actualizarGraficoFuerza() {
        const ejercicio = ejercicios[Number(selector.value)];

        dibujarGraficoFuerza(
            contenedorFuerza,
            ejercicio.entrenamientos
        );
    }

    selector.addEventListener(
        "change",
        actualizarGraficoFuerza
    );

    actualizarGraficoFuerza();

    crearElemento(
        "h4",
        "Volumen de entrenamiento por semana",
        panel
    );

    const contenedorVolumen = document.createElement("div");

    panel.appendChild(contenedorVolumen);

    dibujarGraficoVolumen(contenedorVolumen);
}


// ==========================================
// FUNCIÓN GENERAL PARA DIBUJAR GRÁFICOS
// ==========================================

function dibujarGrafico(contenedor, etiquetas, valores, unidad, tipo) {
    contenedor.replaceChildren();

    if (valores.length === 0) {
        crearElemento(
            "p",
            "Todavía no hay datos suficientes.",
            contenedor
        );

        return;
    }

    const ancho = 600;
    const alto = 280;

    const margenIzquierdo = 55;
    const margenDerecho = 20;
    const margenSuperior = 25;
    const margenInferior = 55;

    const anchoUtil =
        ancho - margenIzquierdo - margenDerecho;

    const altoUtil =
        alto - margenSuperior - margenInferior;

    const maximo = Math.max(...valores, 1);

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
    svg.setAttribute("width", "100%");

    svg.style.background = "white";
    svg.style.borderRadius = "8px";

    contenedor.appendChild(svg);

    function elementoSVG(nombre, atributos, texto) {
        const elemento = document.createElementNS(svgNS, nombre);

        Object.entries(atributos).forEach(([clave, valor]) => {
            elemento.setAttribute(clave, valor);
        });

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        svg.appendChild(elemento);

        return elemento;
    }

    // Líneas horizontales y valores del eje vertical.

    for (let i = 0; i <= 4; i++) {
        const valor = maximo * i / 4;

        const y =
            margenSuperior +
            altoUtil -
            (i / 4) * altoUtil;

        elementoSVG("line", {
            x1: margenIzquierdo,
            y1: y,
            x2: ancho - margenDerecho,
            y2: y,
            stroke: "#e2e8f0"
        });

        elementoSVG("text", {
            x: margenIzquierdo - 8,
            y: y + 4,
            "text-anchor": "end",
            "font-size": 12,
            fill: "#475569"
        }, Number(valor.toFixed(1)).toLocaleString("es-AR"));
    }

    if (tipo === "linea") {
        const puntos = valores.map((valor, indice) => {
            const x =
                margenIzquierdo +
                (
                    valores.length === 1
                        ? anchoUtil / 2
                        : indice * anchoUtil / (valores.length - 1)
                );

            const y =
                margenSuperior +
                altoUtil -
                (valor / maximo) * altoUtil;

            return { x, y, valor };
        });

        if (puntos.length > 1) {
            elementoSVG("polyline", {
                points: puntos.map(p => `${p.x},${p.y}`).join(" "),
                fill: "none",
                stroke: "#2563eb",
                "stroke-width": 3
            });
        }

        puntos.forEach((punto, indice) => {
            const circulo = elementoSVG("circle", {
                cx: punto.x,
                cy: punto.y,
                r: 5,
                fill: "#2563eb"
            });

            const titulo = document.createElementNS(svgNS, "title");

            titulo.textContent =
                `${etiquetas[indice]}: ${punto.valor} ${unidad}`;

            circulo.appendChild(titulo);
        });

    } else {
        const espacio = anchoUtil / valores.length;

        valores.forEach((valor, indice) => {
            const alturaBarra = valor / maximo * altoUtil;

            const barra = elementoSVG("rect", {
                x: margenIzquierdo + indice * espacio + espacio * 0.15,
                y: margenSuperior + altoUtil - alturaBarra,
                width: espacio * 0.7,
                height: alturaBarra,
                fill: "#2563eb",
                rx: 4
            });

            const titulo = document.createElementNS(svgNS, "title");

            titulo.textContent =
                `${etiquetas[indice]}: ${valor.toFixed(1)} ${unidad}`;

            barra.appendChild(titulo);
        });
    }

    // Etiquetas del eje horizontal.

    const pasoEtiquetas = Math.max(
        1,
        Math.ceil(etiquetas.length / 6)
    );

    etiquetas.forEach((etiqueta, indice) => {
        if (
            indice % pasoEtiquetas !== 0 &&
            indice !== etiquetas.length - 1
        ) {
            return;
        }

        const x = tipo === "linea"
            ? margenIzquierdo +
              (
                  etiquetas.length === 1
                      ? anchoUtil / 2
                      : indice * anchoUtil / (etiquetas.length - 1)
              )
            : margenIzquierdo +
              (indice + 0.5) * anchoUtil / etiquetas.length;

        elementoSVG("text", {
            x: x,
            y: alto - 25,
            "text-anchor": "middle",
            "font-size": 11,
            fill: "#475569"
        }, etiqueta);
    });

    crearElemento(
        "p",
        `Unidad: ${unidad}`,
        contenedor
    );
}


// ==========================================
// GRÁFICO DE FUERZA
// ==========================================

function dibujarGraficoFuerza(contenedor, entrenamientos) {
    const registros = [...entrenamientos]
        .filter(e => !Number.isNaN(new Date(e.fecha).getTime()))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const etiquetas = [];
    const valores = [];

    registros.forEach(entrenamiento => {
        const pesos = entrenamiento.series
            .map(serie => Number(serie.peso))
            .filter(peso => Number.isFinite(peso) && peso >= 0);

        if (pesos.length === 0) return;

        etiquetas.push(
            new Date(entrenamiento.fecha).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit"
            })
        );

        valores.push(Math.max(...pesos));
    });

    dibujarGrafico(
        contenedor,
        etiquetas,
        valores,
        "kg",
        "linea"
    );
}


// ==========================================
// GRÁFICO DE VOLUMEN SEMANAL
// ==========================================

function dibujarGraficoVolumen(contenedor) {
    const semanas = new Map();

    datos.dias.forEach(dia => {
        dia.ejercicios.forEach(ejercicio => {
            ejercicio.entrenamientos.forEach(entrenamiento => {
                const fecha = new Date(entrenamiento.fecha);

                if (Number.isNaN(fecha.getTime())) return;

                // Inicio de la semana: lunes.

                const inicio = new Date(
                    fecha.getFullYear(),
                    fecha.getMonth(),
                    fecha.getDate()
                );

                const diaSemana = (inicio.getDay() + 6) % 7;

                inicio.setDate(inicio.getDate() - diaSemana);

                const clave = [
                    inicio.getFullYear(),
                    String(inicio.getMonth() + 1).padStart(2, "0"),
                    String(inicio.getDate()).padStart(2, "0")
                ].join("-");

                let volumen = 0;

                entrenamiento.series.forEach(serie => {
                    const peso = Number(serie.peso);
                    const repeticiones = Number(serie.repeticiones);

                    if (
                        Number.isFinite(peso) &&
                        Number.isFinite(repeticiones) &&
                        peso >= 0 &&
                        repeticiones >= 0
                    ) {
                        volumen += peso * repeticiones;
                    }
                });

                semanas.set(
                    clave,
                    (semanas.get(clave) || 0) + volumen
                );
            });
        });
    });

    const ordenadas = [...semanas.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]));

    const etiquetas = ordenadas.map(([fecha]) => {
        const [anio, mes, dia] = fecha.split("-");

        return `${dia}/${mes}`;
    });

    const valores = ordenadas.map(([, volumen]) => volumen);

    dibujarGrafico(
        contenedor,
        etiquetas,
        valores,
        "kg de volumen",
        "barras"
    );
}