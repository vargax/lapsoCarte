import MainController from './GUIController.js';
import * as support from './Support.js';
import * as glbs from './../../../Globals.js';

import L from'leaflet';
require('leaflet-providers');

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const MAP_CENTER = glbs.PROJECT.MAP_CENTER;
const MAP_ZOOM = glbs.PROJECT.MAP_ZOOM;
const MAP_ZOOM_RANGE = glbs.PROJECT.MAP_ZOOM_RANGE;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let map;
let _geoJsonLayer;

let geometriesMap;

let timeLayers;
let _currentTime;
let _currentHighlightedFeatures;

let infoWidget;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let leafletController = null; // --> Singleton Pattern, so groupTimeLayer instances could access the controller...
export default class LeafletController {
    constructor() {
        if (!leafletController) {
            leafletController = this;
            mainController = new MainController();

            _geoJsonLayer = L.geoJson();
            _currentHighlightedFeatures = new Map();
        }
        return leafletController;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_setGeometries(geomMap) {
        geometriesMap = geomMap;

        for (let [gid, geometry] of geometriesMap) {
            _geoJsonLayer.addData(geometry);
        }
    }

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

    mc_initMap() {
        map = L.map('map',{zoomControl: false}).setView(MAP_CENTER, MAP_ZOOM);

        map.addLayer(_geoJsonLayer);

        map.addLayer(new L.tileLayer.provider(glbs.PROJECT.LAYER_PROVIDER));
        map._layersMinZoom = MAP_ZOOM_RANGE[0];
        map._layersMaxZoom = MAP_ZOOM_RANGE[1];

        map.addControl(L.control.scale({imperial: false, position: 'bottomleft'}));
        map.addControl(L.control.zoom({position: 'bottomright'}));

        map.addControl(support.Widgets.getLocateWidget());

        infoWidget = support.Widgets.getInfoWidget();
        map.addControl(infoWidget);
    }
}


