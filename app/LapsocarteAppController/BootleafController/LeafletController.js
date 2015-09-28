import MainController from './BootleafController.js';
import * as support from './Support.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;

let map;
let timeLayers;
let _currentTime;
let _currentHighlightedFeatures;

let infoWidget;

let leafletController = null; // --> Singleton Pattern, so groupTimeLayer instances could access the controller...
export default class LeafletController {
    constructor() {
        if (!leafletController) {
            leafletController = this;
            mainController = new MainController();
            this._initMap();

            _currentHighlightedFeatures = new Map();
        }
        return leafletController;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_setTime(time) {
        try {
            this.mc_resetAllFeatures();
            map.removeLayer(timeLayers.get(_currentTime).getLayer()); // --> EAFP Pattern
        } catch (e) {
            console.log('+! This was the first layer');
        }
        _currentTime = time;
        map.addLayer(timeLayers.get(_currentTime).getLayer());
    }

    mc_resetFeature(featureId) {
        let feature = timeLayers.get(_currentTime).getFeature(featureId);
        feature.setStyle(support.LayerStyle.choroplethStyle(feature));
        _currentHighlightedFeatures.delete(featureId);
        infoWidget.update();
    }

    mc_resetAllFeatures() {
        for (let feature of _currentHighlightedFeatures.values()) {
            feature.setStyle(support.LayerStyle.choroplethStyle(feature));
        }
        _currentHighlightedFeatures.clear();
        infoWidget.update();
    }

    mc_highlightFeature(featureId) {
        let feature = timeLayers.get(_currentTime).getFeature(featureId);
        feature.setStyle(support.LayerStyle.getFocusedLayerStyle());
        _currentHighlightedFeatures.set(featureId,feature);
        infoWidget.update(feature);
    }

    mc_setTimeLayers(timeLayersP) {
        timeLayers = timeLayersP;
    }

    mc_getMap() {
        return map;
    }

    // Private methods -----------------------------------------------------------
    _initMap() {
        let mapInitParameters = MainController.llc_getInitialMapParameters();
        let center = mapInitParameters[0];
        let zoom = mapInitParameters[1];
        let zoomRange =   mapInitParameters[2];

        map = L.map('map',{zoomControl: false}).setView(center, zoom);
        map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
        map._layersMinZoom = zoomRange[0];
        map._layersMaxZoom = zoomRange[1];

        map.addControl(L.control.scale({imperial: false, position: 'bottomleft'}));
        map.addControl(L.control.zoom({position: 'bottomright'}));

        map.addControl(support.Widgets.getLocateWidget());

        infoWidget = support.Widgets.getInfoWidget();
        map.addControl(infoWidget);
    }
}


