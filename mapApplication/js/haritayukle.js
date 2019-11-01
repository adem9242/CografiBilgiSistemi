//amacım verileri veritabanından xml ile alıp coordinatları harita yüklendiğinde göstermektir.çalışmam devam etmektedir.
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        anchor: [0.5, 41],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: '/airplanes.png'
    }))
});

var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var source = new ol.source.Vector({});

var vector = new ol.layer.Vector({
    source: source,
    style: iconStyle

});

var map;
var map = new ol.Map({
    layers: [raster, vector],
    target: 'map-canvasim',
    view: new ol.View({
        center: [3959123.1209, 4808334.7701],
        zoom: 6.1,
        projection: "EPSG:3857"

    })
});
var places = [[0.25545, 2.6565, "ornekcoordinat1"], [5.56589, 6.45456563, "ornekcoordinat2"]];
for (var i = 0; i < places.length; i++) {
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([places[i][0], places[i][1]], 'EPSG:4326', 'EPSG:3857')),
        name: places[i][2]
    });

    source.addFeature(iconFeature);
} 
var element = document.getElementById('popup');
var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
});
map.addOverlay(popup);

map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            return feature;
        });
    if (feature) {
        popup.setPosition(evt.coordinate);
        $(element).popover({
            'placement': 'top',
            'html': true,
            'content': feature.get('name')
        });
        $(element).popover('show');
    }
    else {
        $(element).popover('destroy');
    }
});
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});