let map;
var markers = [];
var polylines = [];

function initMap() {
    const position = [3.435611, -76.519670];
    map = L.map('map').setView(position, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var trafficLayer = L.tileLayer('https://tile-{s}.openstreetmap.de/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
    trafficLayer.addTo(map);
    
    // show the scale bar on the lower left corner
    L.control.scale({imperial: false, metric: true}).addTo(map);

    var ws = new WebSocket('ws://38.50.50.117:10001');

    ws.onmessage = function (event) {
        var message = event.data;
        if (message.includes('<Evento|') || message.includes('<Estado|')) {
            var eventMessage = message.substring(8, message.length - 1);
            var listItem = document.createElement('li');
            listItem.textContent = eventMessage;
            document.getElementById('event-messages').appendChild(listItem);
        }
    };

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const pos = [lat, lng];
                map.setView(pos, 13);
                //icono = L.divIcon({className: 'blue-pulse-icon',});
                icono = L.icon.pulse({ iconSize: [10, 10], 
                                        color: "#207ED6", 
                                        fillColor: "#003380", 
                                        animate: true });

                L.marker(pos, { icon: icono }).addTo(map).bindPopup('Aquí estoy!').openPopup();
            },
            () => {
                alert('Geolocation service failed.');
            }
        );
    } else {
        // Browser doesn't support Geolocation
        alert("Your browser doesn't support geolocation.");
    }

    loadMarkersFromXML();
    setInterval(loadMarkersFromXML, 30000);
}

function getCustomEquipoIcon(estado) {
    switch (estado) {
        case '1':
            return 'resources/IconoVerde.svg';//25
        case '2':
            return 'resources/IconoBase.svg';//15
        case '3':
            return 'resources/IconoAzul.svg';//30
        case '4':
            return 'resources/GIFIconoAmarilloV2.gif';//30
        case '5':
            return 'resources/IconoRojo.svg';//18
        case '6':
            return 'resources/IconoNaranja.svg';//25
        default:
            return 'resources/IconoBase.svg';//25
    }
}

function getCustomCruceIcon(estado) {
    switch (estado) {
        case '1':
            return 'resources/cruce_1.png';
        case '2':
            return 'resources/cruce_2.png';    
        case '3':
            return 'resources/cruce_3.png';
        case '4':
            return 'resources/cruce_4.gif';
        case '5':
            return 'resources/cruce_5.png';
        case '6':
            return 'resources/cruce_6.png';    
        case '7':
            return 'resources/IconoReloj.svg';
        case '8':
            return 'resources/IconoB.svg';
        case '9':
            return 'resources/IconoEngranajes.svg';
        case '10':
            return 'resources/IconoEngranajeAzul.svg';
        default:
            return 'resources/IconoReloj.svg';
    }
}

function getCustomGrupoIcon(estado) {
    switch (estado) {
        case '1':
            return 'resources/SemaforoEncendido.svg';
        case '2':
            return 'resources/SemaforoApagado.svg';
        case '3':
            return 'resources/SemaforoMano.svg';
        case '4':
            return 'resources/grupo_4.gif';
        case '5':
            return 'resources/SemaforoReloj.svg';
        case '6':
            return 'resources/SemaforoRojo.svg';
        case '7':
            return 'resources/SemaforoRojoAmarillo.svg';
        case '8':
            return 'resources/SemaforoVerde.svg';
        case '9':
            return 'resources/SemaforoAmarillo.svg';
        case '10':
            return 'resources/SemaforoEncendidoEngra.svg';
        case '11':
            return 'resources/SemaforoRojoEngra.svg';                
        case '12':
            return 'resources/SemaforoRojoAmarilloEngra.svg';                    
        case '13':
            return 'resources/SemaforoVerdeEngra.svg';                
        case '14':
            return 'resources/SemaforoAmarilloEngra.svg';                
        case '15':
            return 'resources/SemaforoEngranajes.svg';                
        case '16':
            return 'resources/SemaforoB.svg'; 
        
        case '17':
            return 'resources/FlechaAzul.svg';
        case '18':
            return 'resources/FlechaNegra.svg';
        case '19':
            return 'resources/FlechaAzulMano.svg';
        case '20':
            return 'resources/grupo_4.gif';
        case '21':
            return 'resources/FlechaAzulReloj.svg';
        case '22':
            return 'resources/FlechaRoja.svg';
        case '23':
            return 'resources/FlechaRojaDegradado.svg';
        case '24':
            return 'resources/FlechaVerde.svg';
        case '25':
            return 'resources/FlechaAmarilla.svg';
        case '26':
            return 'resources/FlechaAzulEngra.svg';
        case '27':
            return 'resources/FlechaRojaEngra.svg';                
        case '28':
            return 'resources/FlechaRojaDegradadoEngra.svg';                    
        case '29':
            return 'resources/FlechaVerdeEngra.svg';                
        case '30':
            return 'resources/FlechaAmarillaEngra.svg';                
        case '31':
            return 'resources/FlechaGris.svg';                
        case '32':
            return 'resources/FlechaMorada.svg'; 
        case '33':
            return 'resources/PersonaAzul.svg'; 
        case '34':
            return 'resources/PersonaNegro.svg'; 
        case '35':
            return 'resources/PersonaAzulMano.svg'; 
        case '36':
            return 'resources/PersonaAmarillo.svg';                      
        case '37':
            return 'resources/PersonaAzulReloj.svg';              
        case '38':
            return 'resources/PersonaRojo.svg';  
        case '39':
            return 'resources/PersonaVerde.svg';  
        case '40':
            return 'resources/PersonaAzulEngra.svg';  
        case '41':
            return 'resources/PersonaRojaEngra.svg';  
        case '42':
            return 'resources/PersonaVerdeEngra.svg';  
        case '43':
            return 'resources/PersonaGris.svg';  
        case '44':
            return 'resources/PersonaMorado.svg';  
        case '45':
            return 'resources/Advertencia.svg';  
        case '46':
            return 'resources/AdvertenciaNegro.svg';    
        default:
            return 'resources/FlechaGris.svg';
    }
}

function convertHexColor(color) {
    if (color.startsWith('0x')) {
        hex = '#' + color.slice(2);
    }
    // Convierte un color hexadecimal a RGB para Leaflet.js
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgb ? `rgb(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)})` : null;
}

function createMarker(position, title, iconUrl, iconSize = [25, 25], rotation = 0) {
    var icon = L.icon({
        iconUrl: iconUrl,
        iconSize: iconSize
    });

    var marker = L.marker(position, { icon: icon, title: title, rotationAngle: rotation }).addTo(map);

    //marker.bindTooltip(title);
    marker.on('click', function() {
        marker.bindPopup(title).openPopup();
    });

    return marker;
}

function loadMarkersFromXML() {
    $.ajax({
        url: 'http://38.50.50.117/CentralMap/info.aspx?idUsuario=d08e5567-8230-4df7-a0b4-cf8da9a8a29d&zoom=6&aux=20114395153483',
        dataType: 'xml',
        success: function (data) {
            // Clear previous markers and polylines
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            polylines.forEach(polyline => map.removeLayer(polyline));
            polylines = [];

            // Process corridors (corredores)
            $(data).find('corredor').each(function () {
                var nombre = $(this).find('nombre').text();
                var color = $(this).find('colorCorredor').text();
                var grosor = parseInt($(this).find('grosor').text());
                var puntosStr = $(this).find('puntos').text();
                var puntos = [];

                // Split the points string by ';' and then by ',' to extract lat/lng pairs
                puntosStr.split(';').forEach(function (punto) {
                    var coords = punto.split(',');
                    if (coords.length == 2) {
                        var latitud = parseFloat(coords[0].trim());
                        var longitud = parseFloat(coords[1].trim());
                        puntos.push([latitud, longitud]);
                    }
                });

                var polyline = L.polyline(puntos, {
                    color: convertHexColor(color),
                    weight: grosor,
                    opacity: 0.6
                }).addTo(map);

                polylines.push(polyline);
            });

            // Process groups (grupos)
            $(data).find('grupo').each(function () {
                var numero = $(this).find('numero').text();
                var nombre = $(this).find('nombre').text();
                var latitud = parseFloat($(this).find('ptoY').text());
                var longitud = parseFloat($(this).find('ptoX').text());
                var estado = $(this).find('estado').text();
                var angulo = parseFloat($(this).find('angulo').text());
                var title = `Grupo # ${numero} \n${nombre}`;

                if(estado > 16 && estado != 20){
                    var marker = createMarker(
                        [latitud, longitud],
                        title,
                        getCustomGrupoIcon(estado),
                        [25, 25], // Default size for group icons
                        angulo // Rotate icon by angle
                    );
                } else {
                    var marker = createMarker(
                        [latitud, longitud],
                        title,
                        getCustomGrupoIcon(estado),
                        [30, 30], 
                    );
                }

                if (marker) {
                    markers.push(marker);
                }
            });

            // Process crosses (cruces)
            $(data).find('cruce').each(function () {
                var numero = $(this).find('numero').text();
                var nombre = $(this).find('nombre').text();
                var latitud = parseFloat($(this).find('ptoY').text());
                var longitud = parseFloat($(this).find('ptoX').text());
                var estado = $(this).find('estado').text();
                var title = `Cruce # ${numero} \n${nombre}`;

                var marker = createMarker(
                    [latitud, longitud],
                    title,
                    getCustomCruceIcon(estado),
                    [25, 25] // Default size for cross icons
                );

                if (marker) {
                    markers.push(marker);
                }
            });

            // Process teams (equipos)
            $(data).find('equipo').each(function () {
                var numero = $(this).find('numero').text();
                var nombre = $(this).find('nombre').text();
                var latitud = parseFloat($(this).find('ptoY').text());
                var longitud = parseFloat($(this).find('ptoX').text());
                var estado = $(this).find('estado').text();
                var title = `Equipo # ${numero} \n${nombre}`;

                switch (estado) {
                    case '1':
                        scaledSize = [25, 25];//25
                        break;
                    case '2':
                        scaledSize = [15, 15];//15
                        break;
                    case '3':
                        scaledSize = [30, 30];//30
                        break;
                    case '4':
                        scaledSize = [30, 30];//30
                        break;
                    case '5':
                        scaledSize = [18, 18];//18
                        break;
                    case '6':
                        scaledSize = [25, 25];//25
                        break;
                    default:
                        scaledSize = [25, 25];//25
                        break;
                }

                var marker = createMarker(
                    [latitud, longitud],
                    title,
                    getCustomEquipoIcon(estado),
                    scaledSize
                );

                if (marker) {
                    markers.push(marker);
                }
            });

            $("#error-message").hide();
        },
        error: function (xhr, status, error) {
            if (error === "timeout") {
                console.error('Error al cargar los datos del servidor:', error);
                $("#error-message").show();
            }
        }
    });
}

$(document).ready(function () {
    initMap();
});
