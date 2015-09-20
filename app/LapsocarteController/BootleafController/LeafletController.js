import MainController from './BootleafController.js';
import * as support from './Support.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;

let _map;
let _layers;
let _currentTimeLayer;
let _currentHighlightedFeatures;

let infoWidget;

export default class LeafletController {
    constructor() {
        mainController = new MainController();
        this._initMap();

        _layers = new Map();
        _currentHighlightedFeatures = new Map();
        _currentTimeLayer = null;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_resetFeature(featureId) {
        let feature = _currentTimeLayer.getFeatures().get(featureId);
    }

    mc_highlightFeature(featureId) {
        let feature = _currentTimeLayer.getFeatures().get(featureId);
        feature.setStyle(support.LayerStyle.getFocusedLayerStyle());
        _currentHighlightedFeatures.set(featureId,feature);

        //for (let [key,feature] of _currentHighlightedFeatures) {
        //    feature.setStyle(support.LayerStyle.choroplethStyle(feature));
        //    _currentHighlightedFeatures.delete(key);
        //}
        //
        //for (let featureId in featuresIds) {
        //    let feature = _currentTimeLayer.getFeatures().get(featureId);
        //    feature.setStyle(support.LayerStyle.getFocusedLayerStyle());
        //    _currentHighlightedFeatures.set(featureId,feature);
        //}
    }

    mc_addTimeLayer(time, geoJSON) {
        let timeLayer = new TimeLayer(time,geoJSON);
        _layers.set(time, timeLayer);
    }

    mc_setTimeLayer(time) {
        try {
            _map.removeLayer(_currentTimeLayer.getLayer()); // --> EAFP Pattern
        } catch (e) {
            console.log('+! This was the first layer');
        }
        _currentTimeLayer = _layers.get(time);
        _map.addLayer(_currentTimeLayer.getLayer());
    }

    mc_getMap() {
        return _map;
    }

    mc_getCurrentLayer() {
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

        _map.addControl(support.Widgets.getLocateWidget());

        infoWidget = support.Widgets.getInfoWidget();
        _map.addControl(infoWidget);
    }
}

var features = new Map();
class TimeLayer {
    constructor(time, geoJSON) {
        this.time = time;
        this.layer = L.geoJson(geoJSON, {
            //style: support.LayerStyle.choroplethStyle,
            onEachFeature: this.featureSetup
        });
        this._saveFeatures();
    }

    getLayer() {
        return this.layer;
    }

    getFeatures() {
        return this.features;
    }

    featureSetup(feature, layer) {

        function featureSelect() {
            layer.setStyle(support.LayerStyle.getFocusedLayerStyle());
            infoWidget.update(feature.properties);
        }

        function featureDeselect() {
            layer.setStyle(support.LayerStyle.choroplethStyle(layer));
            infoWidget.update();
        }

        features.set(layer._leaflet_id, layer);
        layer.setStyle(support.LayerStyle.choroplethStyle(layer));
        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });
    }

    _saveFeatures() {
        this.features = features;
        features = new Map();  // Cleaning global container to be ready for the next TimeLayer...
    }
}
