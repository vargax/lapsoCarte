import support from 'lapsocarte/client/support.js';
import geostats from 'geostats/lib/geostats.js';
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
        style: choroplethStyle,
        onEachFeature: featureInteraction
    }).addTo(map);

    function featureInteraction(feature, layer) {

        function featureSelect() {
            layer.setStyle(support.css['.focusedobject']);
            info.update(feature.properties);
        }

        function featureDeselect() {
            layer.setStyle(choroplethStyle(feature));
            info.update();
        }

        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });
    }

    function choroplethStyle(feature) {

        function choroplethColor(d) {
            return d > 8000 ? '#800026' :
                d > 7000 ? '#BD0026' :
                    d > 6000 ? '#E31A1C' :
                        d > 5000 ? '#FC4E2A' :
                            d > 4000 ? '#FD8D3C' :
                                d > 3000 ? '#FEB24C' :
                                    d > 2000 ? '#FED976' :
                                        '#FFEDA0';
        }

        return {
            color: choroplethColor(feature.properties.population),
            weight: 1.2
        }
    }

    //layer.bringToBack();
}

module.exports = {
    init: init,
    addLayer: addLayer
};