import MainController from './BootleafController.js';
import * as lcs from './LeafletControllerSupport.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;

let _map;
let _layers;
let _currentTimeLayer;

let infoWidget;

export default class LeafletController {
    constructor() {
        mainController = new MainController();
        this._initMap();

        _layers = {};
        _currentTimeLayer = null;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_addTimeLayer(time, geoJSON) {
        let timeLayer = new TimeLayer(time,geoJSON);
        _layers[time] = timeLayer;
    }

    mc_setTimeLayer(time) {
        try {
            _map.removeLayer(_currentTimeLayer.getLayer()); // --> EAFP Pattern
        } catch (e) {
            console.log('+! This was the first layer');
        }
        _currentTimeLayer = _layers[time];
        _map.addLayer(_currentTimeLayer.getLayer());
    }

    mc_getMap() {
        return _map;
    }

    mc_getCurrentlayer() {
        return _currentTimeLayer;
    }

    // Private methods -----------------------------------------------------------
    _initMap() {
        let mapInitParameters = MainController.llc_getInitialMapParameters();
        let center = mapInitParameters[0];
        let zoom = mapInitParameters[1];
        let zoomRange =   mapInitParameters[2];

        _map = L.map('map',{zoomControl: false}).setView(center, zoom);
        _map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
        _map._layersMinZoom = zoomRange[0];
        _map._layersMaxZoom = zoomRange[1];

        _map.addControl(L.control.scale({imperial: false}));
        _map.addControl(L.control.zoom({position: 'bottomright'}));

        _map.addControl(lcs.Widgets.getLocateWidget());

        infoWidget = lcs.Widgets.getInfoWidget();
        _map.addControl(infoWidget);
    }
}

class TimeLayer {
    constructor(time, geoJSON) {
        this.time = time;
        this.layer = L.geoJson(geoJSON, {
            style: lcs.LayerStyle.choroplethStyle,
            onEachFeature: this.featureInteraction
        });
    }

    getLayer() {
        return this.layer;
    }

    featureInteraction(feature, layer) {

        function featureSelect() {
            layer.setStyle(lcs.LayerStyle.getFocusedLayerStyle());
            infoWidget.update(feature.properties);
        }

        function featureDeselect() {
            layer.setStyle(lcs.LayerStyle.choroplethStyle(feature));
            infoWidget.update();
        }

        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });
    }
}

