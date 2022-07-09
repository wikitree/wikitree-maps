function opsMap() {
    // Leaflet cannot 'redraw' a map once initialized
    // Remove and reload the Header/Map based on current data
    $('#map').remove();
    $('.Header').remove();
    $('.container').append('<div class="Header"><p>WikiTree maintains coordinates for <span id="NoOPS"></span> Place Studies. <a target="_blank"' +
        'href="https://www.wikitree.com/wiki/Project:One Place Studies">Would you like to help expand our database?</a></div>');
    $('.container').append('<div id="loader"><img id="loader-img" src="images/loading.gif" /></div><div id="map"></div>');

    // You guessed it, show a loader until maop is ready
    var checkExist = setInterval(function () {
        if ($('.leaflet-marker-icon').length) {
            $('#loader').remove();
            clearInterval(checkExist);
        }
    }, 10);

    // Base Map Themes
    // Jawg has 50K monthly credit on the access token
    // Base Map Themes
    var jawgL = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        maxZoom: 18,
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>',
        accessToken: 'dZuldnTraznHfIdJdOvxURkgZoe4OgvnQpDkQhaZbKOBxGiWxXqisDJEAiPGnoWy'
    }),
        osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '<a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>'
        });
    jawgD = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        maxZoom: 18,
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>',
        accessToken: 'dZuldnTraznHfIdJdOvxURkgZoe4OgvnQpDkQhaZbKOBxGiWxXqisDJEAiPGnoWy'
    });
    jawgS = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        maxZoom: 18,
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>',
        accessToken: 'dZuldnTraznHfIdJdOvxURkgZoe4OgvnQpDkQhaZbKOBxGiWxXqisDJEAiPGnoWy'
    });
    esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '&copy; Esri | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>'
    });

    var tiles = L.layerGroup([jawgL, osm, jawgD, jawgS, esri]);

    var baseMaps = {
        "OpenStreetMap": osm,
        "World Imagery": esri,
        "Jawg Dark": jawgD,
        "Jawg Steets": jawgS,
        "Jawg Light": jawgL
    }

    // Draw the map with the default OSM theme
    var map = new L.map('map', {
        layers: [osm],
        center: new L.LatLng(0, 0),
        zoom: 2,
        loadingControl: true
    });

    //Add a Layer Control so user can choose the map theme
    var layerControl = L.control.layers(baseMaps).addTo(map);
    L.control.viewMeta({}).addTo(map);

    // Enable Marker Clusters
    var markers = new L.MarkerClusterGroup({
        maxClusterRadius: 100,
        spiderfyDistanceMultiplier: 1
    });

    // Get the CIB OPS JSON
    $.getJSON("https://wikitree.sdms.si/Categories/CIBOnePlaceStudy.json", function (data) {
        // Extract JSON Data to show to user
        var NoOPS = data.features.length;
        document.getElementById('NoOPS').innerHTML = NoOPS.toLocaleString();

        // Populated markers and Popups with JSON data
        var marker = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties.Default.Category.includes("Place Study") === true) {
                    layer.bindPopup('<span style="font-weight: bold;">' +
                        '<a target="_blank" href="https://www.wikitree.com/wiki/Category:' + feature.properties.Default.Category +
                        '">' + feature.properties.Default.Category + '</a></span>')
                }
            },
            pointToLayer: function (feature, latlng) {
                if (feature.properties.Default.Category.includes("Place Study") === true) {
                    if (latlng.alt == 1) {
                        var blackIcon = L.icon({
                            iconUrl: 'images/marker-icon-2x-black.png',
                            shadowUrl: 'images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, {
                            icon: blackIcon
                        });
                    }
                    else if (latlng.alt != 1) {
                        var redIcon = L.icon({
                            iconUrl: 'images/marker-icon-2x-red.png',
                            shadowUrl: 'images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, { icon: redIcon });
                    };
                }
            }
        });
        markers.addLayer(marker);
    })
    map.addLayer(markers);

    // Add a WikiTree watermark
    L.Control.Watermark = L.Control.extend({
        onAdd: function (map) {
            var img = L.DomUtil.create('img');
            img.src = 'https://www.wikitree.com/images/wikitree-logo.png';
            img.style.width = '200px';
            return img;
        }, onRemove: function (map) { }
    });
    L.control.watermark = function (opts) {
        return new L.Control.Watermark(opts);
    };
    L.control.watermark({ position: 'bottomleft' }).addTo(map);

    // Add Legend
    L.control.Legend({
        position: "topleft",
        title: "Marker Legend",
        collapsed: true,
        legends: [
            {
                label: "One Place Study",
                type: "image",
                url: 'images/marker-icon-2x-black.png'
            }
        ]
    }).addTo(map);
}