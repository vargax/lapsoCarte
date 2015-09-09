import css from 'modules/support.js';
import L from'leaflet';
require('leaflet-providers');

var map;

function createMap(center, zoom, zoomRange) {
    map = L.map('map').setView(center, zoom);
    map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
    map._layersMinZoom = zoomRange[0];
    map._layersMaxZoom = zoomRange[1];

    (L.control.scale({imperial: false})).addTo(map);
}

function addLayer(msg) {
    console.log(':+ Adding a new layer to the map: ');
    console.dir(msg);
    var layer = L.geoJson(msg, {
        style: css['.layer'],
        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: function () {
                    layer.setStyle(css['.focusedobject']);
                },
                mouseout: function () {
                    layer.setStyle(css['.layer']);
                },
                click: function (e) {
                    map.fitBounds(e.target.getBounds());
                }
            });
        }
    });
    console.log(css['.layer']);
    layer.addTo(map);
    layer.bringToBack();
}

module.exports = {
    createMap: createMap,
    addLayer: addLayer
};