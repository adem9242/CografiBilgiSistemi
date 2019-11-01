
var a = document.getElementById("gel").value;

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
var kapi;
var ondrawend = function (e) {
    console.log(e.feature.getGeometry().getCoordinates());
    var currentFeature = e.feature;
    var _coords = currentFeature.getGeometry().getCoordinates();
    document.getElementById("koordinat").value = _coords[0].toString().replace(',') + "  " + _coords[1].toString().replace(',');
    var koordinatkapi = _coords[0].toString().replace("[',']", '-') + "," + _coords[1].toString().replace("[',']", '-');
    kapi.setActive(false);
    var _data = {
        //kapının kordinatlarını x ve y değişkenlerine attım
        koordinatkapi: koordinatkapi,

    };
    function loadDoc() {
        $.ajax({
            url: '/Default/SavePointKapim',
            type: 'POST',
            dataType: 'json',
            data: _data,
            success: function (data) {
                $("#ornek").val(data);
            }
        });
    }

    jsPanel.create({
        id: "kapi_ekle_panel",
        theme: 'success',
        headerTitle: 'KAPİ_EKLE',
        position: 'center-top 0 58',
        contentSize: '600 250',
        content:
            'Mahalle Kodu:<input id="ornek"; style="margin-left:35px; font-size:20px; width:450px;height:45px;"; type="text"disabled/><br><br>Kapı No: <input style="margin-left:55px; font-size:20px; width:450px;height:45px;" id="kapino" value="0"; type="text"/><br><br><button id="kapikaydet" style="font-size:20px;border-radius:5px; background-color:#008b00;border:0;color:white; height:40px;width:80px" class="btn btn-success">Kaydet</button>',
        callback: function () {
            this.content.style.padding = '20px';
        }

    });
    loadDoc();
    document.getElementById('kapikaydet').onclick = function () {
        var a = document.getElementById('kapino').value;
        var b = document.getElementById('ornek').value;

        var koordinat = _coords[0].toString().replace("[',']", '-') + "," + _coords[1].toString().replace("[',']", '-');
        if (a === "") {
            alert('Kapı Numarası Girmediniz');
        }
        else {
            var _data = {
                //kapının kordinatlarını x ve y değişkenlerine attım
                koordinatkapi: koordinat,
                mahkodu: b,
                kapino: a
            };

            $.ajax({
                type: "POST",
                url: "/Default/SavePointKapi",
                dataType: 'json',
                data: _data,
                success: function (message) {
                    alert("Başarıyla Eklendi");

                },
                error: function () {
                    alert("Hata Oluştu");
                },

                onbeforeclose: function () {

                    return onbeforeclose();
                },
            });
        }
    };
}
function addInteraction() {
    console.log(1);
    kapi = new ol.interaction.Draw({
        features: features,
        type: 'Point',
        style: iconStyle
    });
    kapi.on('drawend', ondrawend);
    map.addInteraction(kapi);
    kapi.setActive(false);
}
    function ActiveKapi() {
        kapi.setActive(true);
}
addInteraction();
