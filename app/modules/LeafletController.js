import MainController from './MainController.js'
import widgets from './widgets.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;

let _map;
let _layers;
let _currentLayer;

let infoWidget;

export default class LeafletController {
    constructor() {
        mainController = new MainController();
        this._initMap();

        _layers = {};
        _currentLayer = null;
    }

    addTimeLayer(time, geoJSON) {
        let timeLayer = TimeLayer(time,geoJSON);
        _layers[time] = timeLayer;
    }

    setTimeLayer(time) {
        try {
            _map.removeLayer(_currentLayer); // --> EAFP Pattern
        } catch (e) {
            console.log('+! This was the first layer');
        }
        _currentLayer = _layers[time];
        map.addLayer(_currentLayer);
    }

    getMap() {
        return _map;
    }

    _initMap() {
        let mapInitParameters = mainController.llc_getInitialMapParameters();
        let center = mapInitParameters[0];
        let zoom = mapInitParameters[1];
        let zoomRange =   mapInitParameters[2];

        _map = L.map('map',{zoomControl: false}).setView(center, zoom);
        _map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
        _map._layersMinZoom = zoomRange[0];
        _map._layersMaxZoom = zoomRange[1];

        _map.addControl(L.control.scale({imperial: false}));
        _map.addControl(L.control.zoom({position: 'bottomright'}));

        _map.addControl(widgets.getLocateWidget());

        infoWidget = widgets.getInfoWidget();
        _map.addControl(infoWidget);
    }
}

class TimeLayer {
    constructor(time, geoJSON) {
        this.time = time;
        this.layer = L.geoJson(geoJsonLayer, {
            style: choroplethStyle,
            onEachFeature: featureInteraction
        });
    }

    featureInteraction(feature, layer) {

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

    choroplethStyle(feature) {

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