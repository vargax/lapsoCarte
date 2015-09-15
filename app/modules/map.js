import support from './support';
import widgets from './widgets.js';
//import geostats from 'geostats/lib/geostats.js';

import L from'leaflet';
require('leaflet-providers');

var map;
var infoWidget;
var timeWidget;

var timeLayers;
var currentLayer;

function init(center, zoom, zoomRange) {
    map = L.map('map').setView(center, zoom);
    map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
    map._layersMinZoom = zoomRange[0];
    map._layersMaxZoom = zoomRange[1];

    map.addControl(L.control.scale({imperial: false}));

    infoWidget = widgets.getInfoWidget();
    map.addControl(infoWidget);

    timeLayers = {};
}

function addTimeLayer(t, geoJsonLayer) {
    //console.dir(geoJsonLayer);

    let layer = L.geoJson(geoJsonLayer, {
        style: choroplethStyle,
        onEachFeature: featureInteraction
    });

    timeLayers[t] = layer;
    console.log(':+ Adding a new layer for t = ' + t);

    function featureInteraction(feature, layer) {

        function featureSelect() {
            layer.setStyle(support.css['.focusedobject']);
            infoWidget.update(feature.properties);
        }

        function featureDeselect() {
            layer.setStyle(choroplethStyle(feature));
            infoWidget.update();
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
}

function setTimeLayer(t) {
    if (currentLayer != undefined) {
        map.removeLayer(currentLayer);
    }
    currentLayer = timeLayers[t];
    map.addLayer(currentLayer);
}

module.exports = {
    init: init,
    addTimeLayer: addTimeLayer,
    setTimeLayer: setTimeLayer
};