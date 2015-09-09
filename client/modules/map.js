import support from 'modules/support.js';
import L from'leaflet';
require('leaflet-providers');

var map;
var info;

function init(center, zoom, zoomRange) {
    map = L.map('map').setView(center, zoom);
    map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
    map._layersMinZoom = zoomRange[0];
    map._layersMaxZoom = zoomRange[1];

    (L.control.scale({imperial: false})).addTo(map);

    info = new L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (sptlObjAttr) {
        // ToDo :: Put this HTML outside the JS code... (something like the support.js crack for the css')
        let html = '<h4> Data </h4>';
        for (let item in sptlObjAttr) {
            html += '<b>' + item + '</b> ' + sptlObjAttr[item] + '</b> <br />';
        }
        this._div.innerHTML = html;
    };
    info.addTo(map);
}

function addLayer(geoJsonLayer) {
    console.log(':+ Adding a new layer to the map: ');
    //console.dir(geoJsonLayer);

    var layer = L.geoJson(geoJsonLayer, {
        style: support.css['.layer'],
        onEachFeature: featureInteraction
    }).addTo(map);

    function featureInteraction(feature, layer) {

        function featureSelect() {
            layer.setStyle(support.css['.focusedobject']);
            info.update(feature.properties);
        }

        function featureDeselect() {
            layer.setStyle(support.css['.layer']);
            info.update();
        }

        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });
    }

    //layer.bringToBack();
}

module.exports = {
    init: init,
    addLayer: addLayer
};