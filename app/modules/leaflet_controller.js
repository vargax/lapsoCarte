import widgets from './widgets.js';
import support from './support.js';
//import geostats from 'geostats/lib/geostats.js';

import L from'leaflet';
require('leaflet-providers');

var map;
var infoWidget;

var layers;
var currentLayer;

function init() {
    let mapInitParameters = mainController.llc_getInitialMapParameters();
    let center = mapInitParameters[0];
    let zoom = mapInitParameters[1];
    let zoomRange =   mapInitParameters[2];

    map = L.map('map',{zoomControl: false}).setView(center, zoom);
    map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
    map._layersMinZoom = zoomRange[0];
    map._layersMaxZoom = zoomRange[1];

    map.addControl(L.control.scale({imperial: false}));
    map.addControl(L.control.zoom({position: 'bottomright'}));
    map.addControl(widgets.getLocateWidget());

    infoWidget = widgets.getInfoWidget();
    map.addControl(infoWidget);

    layers = {};
}

function addTimeLayer(t, geoJsonLayer) {
    //console.dir(geoJsonLayer);

    let layer = L.geoJson(geoJsonLayer, {
        style: choroplethStyle,
        onEachFeature: featureInteraction
    });

    layers[t] = layer;
    console.log(':+ Adding a new layer for t = ' + t);
    setTimeLayer(t);

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
    currentLayer = layers[t];
    map.addLayer(currentLayer);
}

function getMap() {
    return map;
}
function getLayers() {
    return layers;
}

module.exports = {
    init: init,
    addTimeLayer: addTimeLayer,
    setTimeLayer: setTimeLayer,
    getMap: getMap,
    getLayers: getLayers
};