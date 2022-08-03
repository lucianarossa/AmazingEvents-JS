let objetoPrincipal;

async function getData() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(data => objetoPrincipal = data);

    let eventos = objetoPrincipal.events;

    //---------------------------------------------------------------------------------------TABLA 1

    //HAGO UN FILTRO CREANDO LA VARIABLE DE EVENTOS PASADOS
    //MAPEO EL ARRAY TOMANDO LAS PROPIEDADES ASSISTANCE Y CAPACITY DE CADA OBJETO, CALCULANDO EN LA VARIABLE PERCENTAGE EL PORCENTAJE DE AMBAS VARIABLES, LAS FIXEO EN NUMEROS ENTEROS, Y EN EL ULTIMO PASO AGREGO AL ARRAY PASTEVENTS LA PROPIEDAD PERCENTAGE.
    //AL FINAL HAGO UN SORT A PASTEVENTS TOMANDO COMO PARAMETRO LOS PERCENTAGE DE CADA ELEMENTO, PARA QUE ME LOS ORDENE DE MAYOR A MENOR.
    //LUEGO HAGO UN FILTRO PARA EXTRAER LAS CAPACIDADES Y ORDENARLAS PARA SABER CUAL ES LA MAYOR

    let pastEvents = eventos.filter(e => e.assistance);


    pastEvents.map(e => {
        let assistance = e.assistance;
        let capacity = e.capacity;
        let percentage = ((assistance / capacity) * 100).toFixed();
        e.percentage = percentage;

    });

    const pastEventsSorted = pastEvents.sort((a, b) => b.percentage - a.percentage);
    let capacity = eventos.filter(e => e.capacity).sort((a, b) => b.capacity - a.capacity);


    //FUNCION TABLA 1.
    //PONGO COMO PARAMETROS EL ARRAY DE EVENTOS ACOMODADO POR PORCENTAJE Y EL ARRAY DE CAPACIDADES ORDENADO

    function table1(pastEventsSorted, capacity) {
        let tableOne = `<tr class= "subtitle">
                           <td class="table-subtitle">Event with the highest percentage of attendance</td>
                           <td class="table-subtitle">Event with the lowest percentage of attendance</td>
                           <td class="table-subtitle">Event with larger capacity</td>
                        </tr>
                        <tr class= "data-table">
                             <td>${pastEventsSorted[0].name}:  ${pastEventsSorted[0].percentage}% of attendance</td>
                             <td>${pastEventsSorted[pastEventsSorted.length - 1].name}:  ${pastEventsSorted[pastEventsSorted.length - 1].percentage}% of attendance </td>
                             <td>${capacity[0].name}:  ${capacity[0].capacity} total capacity</td>
                        </tr>`;
        document.getElementById("tableOne").innerHTML = tableOne;

    }

    table1(pastEventsSorted, capacity);


    //----------------------------------------------------------------------------------TABLA2 UPCOMING EVENTS
    //CREO MI ARRAY PRINCIPAL DE UPCOMING EVENTS

    let upcomingEvents = eventos.filter(e => e.estimate);
    console.log(upcomingEvents);

    //CREO UN ARRAY DE CATEGORIAS FUTURAS, LE APLICO SET PARA ELIMINAR REPETIDOS

    const catUpcoming = upcomingEvents.map(eventos => eventos.category);
    const catUpcomingSet = new Set(catUpcoming);
    const categoryUpc = [...catUpcomingSet];
    console.log(categoryUpc);

    //CREO ARRAY DE OBJETOS CON CATEGORIAS Y EL ARRAY DE EVENTOS

    const arrayCatUpcoming = [];
    categoryUpc.map(category =>
        arrayCatUpcoming.push({
            category: category,
            evento: upcomingEvents.filter(evento => evento.category === category),
        }));
    console.log(arrayCatUpcoming);

    //CREO UN ARRAY DE OBJETOS QUE CONTENGAN TODOS LOS ELEMENTOS NECESARIOS, CAPACITY, CATEGORY, ESTIMATE Y REVENUE

    let categoryUpcomingData = [];
    arrayCatUpcoming.map(datos => {
        categoryUpcomingData.push({
            category: datos.category,
            estimate: datos.evento.map(item => item.estimate),
            capacity: datos.evento.map(item => item.capacity),
            estimateRevenue: datos.evento.map(item => item.estimate * item.price)
        });
    });
    console.log(categoryUpcomingData);

    //SUMO EN CADA CATEGORIA LOS TOTALES DE ESTIMATE, CAPACITY Y ESTIMATE REVENUE

    categoryUpcomingData.forEach(category => {
        let totalEstimate = 0;
        category.estimate.forEach(estimate => totalEstimate += Number(estimate));
        category.estimate = totalEstimate;

        let totalCapacityUpc = 0;
        category.capacity.forEach(capacity => totalCapacityUpc += Number(capacity));
        category.capacity = totalCapacityUpc;

        let totalEstimateRevenue = 0;
        category.estimateRevenue.forEach(estimateRevenue => totalEstimateRevenue += Number(estimateRevenue))
        category.estimateRevenue = totalEstimateRevenue;

        category.porcentajeAttendace = ((totalEstimate * 100) / totalCapacityUpc).toFixed();
    })
    console.log(categoryUpcomingData);

    //FUNCION TABLA 2.

    function table2() {
        let tableTwo = `<tr class= "subtitle">
                           <td class="table-subtitle">Categories</td>
                           <td class="table-subtitle">Estimated</td>
                           <td class="table-subtitle">Percentage of estimated attendance</td>
                       </tr>`
        categoryUpcomingData.forEach(e => {
            e.categoryUpcomingData
            tableTwo += `<tr class= "data-table">
                           <td>${e.category}</td>
                           <td>USD ${e.estimateRevenue}</td>
                           <td>${e.porcentajeAttendace}%</td>
                        </tr>`
        })
        document.getElementById("tableTwo").innerHTML = tableTwo;
    }
    table2();

    //-----------------------------------------------------------------------------------------TABLA3 PAST EVENTS
    //CREO UN ARRAY DE CATEGORIAS PASADAS, LE APLICO SET PARA ELIMINAR REPETIDOS

    const catPast = pastEvents.map(eventos => eventos.category)
    const catPastSet = new Set(catPast)
    const categoryPast = [...catPastSet]
    console.log(categoryPast)

    //CREO ARRAY DE OBJETOS CON CATEGORIAS Y EL ARRAY DE EVENTOS PASADOS

    const arrayCatPast = []
    categoryPast.map(category =>
        arrayCatPast.push({
            category: category,
            evento: pastEvents.filter(evento => evento.category === category),
        }))
    console.log(arrayCatPast)

    //CREO UN ARRAY DE OBJETOS QUE CONTENGAN TODOS LOS ELEMENTOS NECESARIOS, CAPACITY, CATEGORY, ASSISTANCE Y REVENUE

    let categoryPastData = []
    arrayCatPast.map(datos => {
        categoryPastData.push({
            category: datos.category,
            assistance: datos.evento.map(item => item.assistance),
            capacity: datos.evento.map(item => item.capacity),
            revenue: datos.evento.map(item => item.assistance * item.price)
        })
    })
    console.log(categoryPastData)


    //SUMO EN CADA CATEGORIA LOS TOTALES DE ESTIMATE, CAPACITY Y ESTIMATE REVENUE

    categoryPastData.forEach(category => {
        let totalAssistance = 0
        category.assistance.forEach(assistance => totalAssistance += Number(assistance))
        category.assistance = totalAssistance

        let totalCapacityPast = 0
        category.capacity.forEach(capacity => totalCapacityPast += Number(capacity))
        category.capacity = totalCapacityPast

        let totalRevenue = 0
        category.revenue.forEach(revenue => totalRevenue += Number(revenue))
        category.revenue = totalRevenue

        category.attendancePerc = ((totalAssistance * 100) / totalCapacityPast).toFixed()
    })
    console.log(categoryPastData)

    //FUNCION TABLA 3.

    function table3() {
        let tableThree = `<tr class= "subtitle">
                            <td class="table-subtitle">Categories</td>
                            <td class="table-subtitle">Revenues</td>
                            <td class="table-subtitle">Percentage of attendance</td>
                          </tr>`
        categoryPastData.forEach(e => {
            e.categoryPastData
            tableThree += `<tr class= "data-table">
                             <td>${e.category}</td>
                             <td>USD ${e.revenue}</td>
                             <td>${e.attendancePerc}%</td>
                          </tr>`
        })
        document.getElementById("tableThree").innerHTML = tableThree
    }
    table3()


}

getData()