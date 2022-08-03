//CREO UNA FUNCION DETAILS, DECLARANDO UNA VARIABLE PARA EL ID DEL ARRAY. HAGO UN MAP AL ARRAY PARA PODER EXTRAER LOS ID.
//ESTA FUNCION LO QUE HACE ES RELACIONAR EL ID DE CADA EVENTO CON EL LINK DE CADA CARD.



let objetoPrincipal;

async function getData() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(data => objetoPrincipal = data);

    let eventos = objetoPrincipal.events
    console.log(eventos)

    //----------------------------------------------------------------------------------------------------------

    function details() {
        var id = location.search.split("?id=");
        var idSelected = id[1];
        var evento = eventos.find(function(evento) {
            return evento._id == idSelected;

        });

        var cardContainer = `
    <div class="card mb-3" style="max-width: 540px" id="cardDetails"> 
        <div class="row g-0"> 
            <div class="col-md-6">
                <img class="img-fluid rounded-start" src= ${evento.image}/>
            </div>
            <div class="col-md-6">     
                <div class="card-body" id="details-body">
                    <div class="titleDetails">
                        <h5 class="card-title" id="detailstitle">${evento.name}</h5>
                        <h6 class="card-text-details">Date: ${evento.date}</h6>
                        <h6 class="card-text-details-descrption">${evento.description}</h6>
                        <h6 class="card-text-details">Category: ${evento.category}</h6>
                        <h6 class="card-text-details"> Place: ${evento.place}</h6>
                        <p class="card-text-details">Price: $ ${evento.price}</p>
                    </div>
                </div>
            </div>
        </div>    
    </div>`;

        document.getElementById("main-cards").innerHTML = cardContainer;
    }

    details();
}
getData()