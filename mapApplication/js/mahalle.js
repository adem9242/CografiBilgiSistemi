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

var source = new ol.source.Vector({ });

var vector = new ol.layer.Vector({
    source: source
});

var features = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: features
    }),
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            offset: [0, 0],
            opacity: 1,
            scale: 1,
            src: '/airplanes.png'
        })
    })
});
featureOverlay.setMap(map);

var modify = new ol.interaction.Modify({
    features: features,
    deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);   
    },
});
map.addInteraction(modify);
var draw;
var ondrawend = function (e) {
    console.log(e.feature.getGeometry().getCoordinates());
        var currentFeature = e.feature;
    var _coords = currentFeature.getGeometry().getCoordinates();
    document.getElementById("koordinat").value = _coords[0].toString().replace("[',']", '-');
    draw.setActive(false);
    jsPanel.create({
        id: "mahalle_ekle_panel",
        theme: 'success',
        headerTitle: 'MAHALLE_EKLE',
        position: 'center-top 0 58',
        contentSize: '600 250',
        content: 'Mahalle Adı: <input style="font-size:20px; width:450px;height:45px;" name="mahadi" id="mahadi" type="text"/><br><br><br><button id="mahallekaydet" style="font-size:20px;border-radius:5px; background-color:#008b00;border:0;color:white; height:40px;width:80px" class="btn btn-success">Kaydet</button>',
        callback: function () {
            this.content.style.padding = '20px';
        }
    });
    document.getElementById('mahallekaydet').onclick = function () {
        var a = document.getElementById("mahadi").value;
        if (a === "") {
            alert('Mahalle Adını Girmediniz');
        }
        else {
            //mahallenin kordinatlarını  ve adini değişkenlerine attım
            var _data = {
                koordinat: _coords[0].toString().replace("[',']", '-'),
                mahadi: a
            };
            $.ajax({
                type: "POST",
                url: "/Default/SavePointMahalle",
                dataType: 'json',
                data: _data,
                success: function (message) {
                    alert("Başarıyla Eklendi");
                    mahalle.setActive(false);
                },
                error: function () {
                    alert("Hata Oluştu");
                },
                onbeforeclose: function () {
                    return onbeforeclose();
                },
            });
        }
    }
};
function addInteraction() {
    console.log(1);
    draw = new ol.interaction.Draw({
        features: features,
        type: 'Polygon'
    });
    draw.on('drawend', ondrawend);
    map.addInteraction(draw);
    draw.setActive(false);
}
function ActiveMah() {
    draw.setActive(true);
}
addInteraction();



