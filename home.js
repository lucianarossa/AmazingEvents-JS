//CREO UNA FUNCION ASINCRONA, HAGO EL FETCH A LA API, CONVIERTO EL ARCHIVO EN JSON Y CREO UNA VARIABLE OBJETO PRINCIPAL PARA EXTRAER LAS PROPIEDADES.-
//CREO EL ID PARA PUSHEARLO ADENTRO DEL ARRAY Y TOMARLO PARA EL LINK DE DETAILS

getData()

let objetoPrincipal;

async function getData() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(data => objetoPrincipal = data);

    let eventos = objetoPrincipal.events

    //--------------------------------------------------------------------------------------------------------------

    //FILTRADO DE CATEGORIAS Y ELIMINACION DE DUPLICADOS: CON MAP RECORRO EL ARRAY (EVENTOS) Y GUARDO LAS CATEGORIAS (DUPLICADAS). AL ARRAY ANTERIOR (TODASLASCATEGORIAS) LE APLICO SET PARA ELIMINAR DUPLICADOS Y LO GUARDO EN LA VARIABLE CATEGORIAS FILTRADAS. DECLARO UNA NUEVA VARIABLE (CATEGORIAS) PARA ALOJAR EL RESULTADO DE SET APLICADO A CATEGORIAS FILTRADAS. 

    let todasLasCategorias = eventos.map(evento => evento.category);
    let categoriasFiltradas = new Set(todasLasCategorias);
    let categorias = [...categoriasFiltradas];

    //CREACION DE CHECKBOX DINAMICOS: DECLARO VARIABLE VACIA CHECKCONTAINER, LE APLICO UNA FUNCION FOREACH, CON EL PARAMETRO CATEGORIA, PARA QUE RECORRA EL ARRAY COMPLETO Y EN CADA VUELTA ALOJE EN CHECKCONTAINER EL TEMPLATE. LUEGO LLAMO AL DOM, AL ELEMENTO HTML PADRE Y LE IMPRIMO EL CONTENIDO DE CHECKCONTAINER.

    function showCheckBox() {
        let checkContainer = "";
        categorias.forEach(categoria => {
            checkContainer += `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value= "${categoria}" name="Category1" />
            <label class="form-check-label">${categoria}</label>
          </div>`;
        });
        document.getElementById("checkBox").innerHTML = checkContainer;

    }
    showCheckBox();

    //APLICACION DE ESCUCHADOR DE EVENTOS A LOS CHECKBOX: CREO UNA VARIABLE GLOBAL VACIA PARA ALOJAR LOS EVENTOS DE CLICKEO O DESCLICKEO. LUEGO LLAMO Y GUARDO TODOS LOS ELEMENTOS INPUT (CHECKS) EN UNA CONSTANTE PARA USARLOS EN LA FUNCION

    var checksSelected = [];
    const checkBoxes = document.querySelectorAll(".form-check-input");

    //RECORRO EL ARRAY (CHECKBOXES) QUE ALMACENA LOS ELEMENTOS INPUT, CON UN FOREACH PARA APLICARLE A CADA UNO (CHECKS) UN ESCUCHADOR DE EVENTOS TIPO CLICK. CREO UNA FUNCION CON UN CONDICIONAL, EN EL CUAL ESTABLEZCO QUE AL ESCUCHAR "CLICK" (TRUE) INGRESE EL VALOR DEL EVENTO (MEDIANTE UN PUSH) AL ARRAY (CHECKSELECTED) Y QUE SINO LO FILTRE.
    //EN CADA CONIDICIONAL, SEA TRUE O FALSE LLAMO A LA FUNCION EVENTOS FILTRADOS QUE ME TRAERA EL CONTENIDO CORRESPONDIENTE.
    //ESTA FUNCION QUEDARA ALMACENADA EN (CHECKSELECTED) PARA USARLA EN EL FILTRADO.

    checkBoxes.forEach(checks => {
        checks.addEventListener("click", (evento) => {
            var checked = evento.target.checked;
            if (checked) {
                checksSelected.push(evento.target.value);
                eventosFiltrados();
            } else {
                checksSelected = checksSelected.filter(uncheck => uncheck !== evento.target.value);
                eventosFiltrados();
            }
        });
    });

    //APLICACION DE ESCUCHADOR DE EVENTOS A LA BARRA SEARCH: CREO UNA VARIABLE GLOBAL VACIA TIPO STRING, PARA ALOJAR LOS EVENTOS DE TIPO KEYUP. LUEGO LLAMO Y GUARDO EL ELEMENTO "SEARCH" EN UNA CONSTANTE (SEARCHINPUT) PARA USARLOS EN LA FUNCION

    var searchText = "";
    const searchInput = document.getElementById("search");

    //A LA CONSTANTE QUE ALOJA EL ELEMENTO SEARCH, LE APLICO UN ESCUCHADOR DE EVENTOS TIPO "KEYUP" CON UNA FUNCION DE ALOJAR EL VALOR DEL EVENTO.
    //LUEGO LLAMO A LA FUNCION EVENTOS FILTRADOS QUE SERA LA ENCARGADA DE MOSTRAR LAS TARJETAS CORRESPONDIENTES.

    searchInput.addEventListener("keyup", (evento) => {
        searchText = evento.target.value;
        eventosFiltrados();
    });

    //CREACION DE LA FUNCION DE FILTRADO COMBINANDO LOS EVENTOS DE CHECKBOX Y SEARCH: CREO UNA VARIABLE DATOS DE TIPO STRING PARA USARLA COMO PARAMETRO LUEGO. ESTABLEZCO 4 POSIBILIDADES DE COMBINACION DE FILTROS.
    //1 - SI CHECKSELECTED (QUE ARROJA EL EVENTO CLICK) ES MAYOR A CERO (HAY AL MENOS 1 CLICK) Y QUE SEARCHTEXT ES DIFERENTE A UN ARRAY VACIO (TIENE ALGUN VALOR) SE INCLUYA CON PUSH (A DATOS) EL FILTRO A EVENTOS MOSTRANDO EL NOMBRE DEL MISMO EN MINUSCULAS (CON METODO INCLUDES Y TRIM ELIMINANDO ESPACIOS) Y MUESTRE ADEMAS LA CATEGORIA DEL EVENTO SEGUN SU VALOR.  
    //2 - SI CHECKSELECTED (QUE ARROJA EL EVENTO CLICK) ES MAYOR A CERO (HAY AL MENOS 1 CLICK) Y QUE SEARCHTEXT ES IGUAL A UN ARRAY VACIO (NO TIENE NINGUN VALOR) SE INCLUYA CON PUSH (A DATOS) LA CATEGORIA DEL EVENTO SEGUN SU VALOR.  
    //3 - SI CHECKSELECTED (QUE ARROJA EL EVENTO CLICK) ES IGUAL A CERO (ESTA VACIO) Y QUE SEARCHTEXT ES DIFERENTE A UN ARRAY VACIO (TIENE ALGUN VALOR) SE INCLUYA CON PUSH (A DATOS) EL FILTRO A EVENTOS MOSTRANDO EL NOMBRE DEL MISMO EN MINUSCULAS (CON METODO INCLUDES Y TRIM ELIMINANDO ESPACIOS). 
    //4 - SI AMBOS ESTAN VACIOS, SE INCLUYA CON PUSH (A DATOS) EL ARRAY EVENTOS QUE CONTIENE TODAS LAS CARDS.  
    //POR ULTIMO LLAMO A LA FUNCION CARDDATOS (QUE IMPRIME LAS CARDS) Y LE PASO COMO PARAMETRO EL ARRAY (DATOS) QUE CONTIENE ESTOS FILTROS.
    //POR ULTIMO EJECUTO LA FUNCION.

    function eventosFiltrados() {
        let datos = [];
        if (checksSelected.length > 0 && searchText !== "") {
            checksSelected.map(categoria => datos.push(...eventos.filter(evento => evento.name.toLowerCase().includes(searchText.trim().toLowerCase()) && evento.category == categoria)));
        } else if (checksSelected.length > 0 && searchText == "") {
            checksSelected.map(categoria => datos.push(...eventos.filter(evento => evento.category == categoria)));
        } else if (checksSelected.length == 0 && searchText !== "") {
            datos.push(...eventos.filter(evento => evento.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
                evento.category.toLowerCase().includes(searchText.trim().toLowerCase())));
        } else {
            datos.push(...eventos);
        }
        cardDatos(datos);
    }
    eventosFiltrados();

    //CREO LA FUNCION CARD DATOS QUE IMPRIMIRA LOS EVENTOS (LE PONGO COMO PARAMETRO EL ARRAY DE EVENTOS), LO RECORRO CON FOREACH Y LE VOY IMPRIMIENDO EN CARDCONTAINER TODOS LOS OBJETOS DEL ARRAY SEGUN SU INDICE.
    //LLAMO AL ELEMENTO CONTENEDOR HTML Y LE IMPRIMO EL CONTENIDO DE CARDCONTAINER.

    function cardDatos(generico) {
        let cardContainer = "";
        if (generico.length > 0) {
            generico.forEach(e => {
                cardContainer += `<div class="card" style="text-align: center">  
                                  <img class="card-img-top" src= ${e.image}/>
                                  <div class="card-body">
                                     <div class="titleDescrip">
                                       <h5 class="card-title">${e.name}</h5>
                                       <p class="card-text">${e.description}</p>
                                     </div>
                                     <div class="priceyBtn">
                                     <p class="price">Price: USD ${e.price}</p>
                                     <a href="./details.html?id=${e._id}" class="btn btn-outline-dark btn-sm">More Details</a>
                                     </div>
                                  </div>
                             </div>`;
            });
            document.querySelector("#main-cards").innerHTML = cardContainer;
        } else {
            document.querySelector("#main-cards").innerHTML = `<p id="mensajeUps"> UPS! EVENTS NOT FOUND! </p>`
        }
    }
}


//EN EL BOTON DE DETAILS EN EL TEMPLATE DESPUES DE LA RUTA HMTL (ABRO ?${}) Y LE PASO EL PARAMETRO QUE QUIERO QUE BUSQUE (EVENTO.ID)