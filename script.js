var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
console.log(markers);
var data_markers = [];

function onMapLoad() {

    console.log("Mapa cargado");


    //FASE 3.1

    //1) Relleno el data_markers con una petición a la api
    $(document).ready(function() {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "api/apiRestaurants.php",
            success: function(response) {
                console.log(response)
                var data = response;
                rellenarData_Markers(data);
                //2) Añado de forma dinámica en el select los posibles tipos de restaurantes
                var selector = document.getElementById("kind_food_selector");
                var options = ["TODOS"];
                for (datos of data) {
                    if (!options.includes(datos.kind_food)) {
                        options.push(datos.kind_food);
                    }
                }
                options = options.filter(element => !element.includes(','));
                options.forEach(function(text, value) {
                    selector[value] = new Option(text, value);
                });
                //3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
                render_to_map(data_markers, 'all');

            }
        });

    });



}

function rellenarData_Markers(data) {
    console.log("data", data);
    for (datos of data) {
        data_markers.push(datos);

    }
    console.log("data_markers", data_markers);

}



$('#kind_food_selector').on('change', function() {
    console.log(this.value);
    render_to_map(data_markers, this.value);
});



function render_to_map(data_markers, filter) {
    console.log("data_markers", data_markers);
    console.log("filter", filter);
    var marker;
    var popupContent;
    map.setView([41.400, 2.206], 9);

    //FASE 3.2
    //1) Limpio todos los marcadores
    markers.clearLayers();



    //2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
    //para ver por consola el valor de los diferentes kind_food
    for (let i = 0; i < data_markers.length; i++) {
        console.log("kind_food", data_markers[i].kind_food);
    }

    if (filter != 'all' && filter != '0') {
        var selector = document.getElementById("kind_food_selector");
        var text = selector.options[filter].text;
        console.log("opcion del selector", text);
        var data_filtered = data_markers.filter(datos => datos.kind_food.includes(text));

        console.log(data_filtered);

        for (let j = 0; j < data_filtered.length; j++) {
            marker = L.marker([data_filtered[j].lat, data_filtered[j].lng]);
            popupContent = `<div><div>${data_filtered[j].name}</div><div>${data_filtered[j].adress}</div></div>`;
            marker.bindPopup(popupContent).openPopup();
            markers.addLayer(marker);

        }
        //map.fitBounds(markers.getBounds());
        map.addLayer(markers);

    } else if (filter === "all" || filter === "0") {
        for (let i = 0; i < data_markers.length; i++) {
            marker = L.marker([data_markers[i].lat, data_markers[i].lng]);
            popupContent = `<div><div>${data_markers[i].name}</div><div>${data_markers[i].adress}</div></div>`;
            marker.bindPopup(popupContent).openPopup();
            markers.addLayer(marker);

        }
        //map.fitBounds(markers.getBounds());
        map.addLayer(markers);
    }

}