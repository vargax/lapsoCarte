import MainController from './BootleafController.js';
import * as support from './Support.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;

let _map;
let _layers;
let _currentTimeGroupLayer;
let _currentHighlightedLayers;

let infoWidget;

let leafletController = null; // --> Singleton Pattern, so groupTimeLayer instances could access the controller...
export default class LeafletController {
    constructor() {
        if (!leafletController) {
            leafletController = this;
            mainController = new MainController();
            this._initMap();

            _layers = new Map();
            _currentHighlightedLayers = new Map();
            _currentTimeGroupLayer = null;
        }
        return leafletController;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_resetLayer(layerId) {
        if (layerId !== undefined) {
            let layer = _currentHighlightedLayers.get(layerId);
            _currentHighlightedLayers.delete(layerId);
            layer.setStyle(support.LayerStyle.choroplethStyle(layer));
        } else {
            for (let layer of _currentHighlightedLayers.values()) {
                layer.setStyle(support.LayerStyle.choroplethStyle(layer));
            }
            _currentHighlightedLayers.clear();
        }
        infoWidget.update();
    }

    mc_highlightLayer(layerId) {
        let layer = _currentTimeGroupLayer.getLayers().get(layerId);
        layer.setStyle(support.LayerStyle.getFocusedLayerStyle());
        infoWidget.update(layer);
        _currentHighlightedLayers.set(layerId,layer);
    }

    mc_addTimeGroupLayer(time, geoJSON) {
        let timeLayer = new GroupTimeLayer(time,geoJSON);
        _layers.set(time, timeLayer);
    }

    mc_setTimeGroupLayer(time) {
        try {
            _map.removeLayer(_currentTimeGroupLayer.getGroupLayer()); // --> EAFP Pattern
        } catch (e) {
            console.log('+! This was the first layer');
        }
        _currentTimeGroupLayer = _layers.get(time);
        _map.addLayer(_currentTimeGroupLayer.getGroupLayer());
    }

    mc_getMap() {
        return _map;
    }

    mc_getCurrentLayer() {
        return _currentTimeGroupLayer;
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

        _map.addControl(L.control.scale({imperial: false, position: 'topleft'}));
        _map.addControl(L.control.zoom({position: 'bottomright'}));

        _map.addControl(support.Widgets.getLocateWidget());

        infoWidget = support.Widgets.getInfoWidget();
        _map.addControl(infoWidget);
    }
}

let layers = new Map();
class GroupTimeLayer {
    constructor(time, geoJSON) {
        this.time = time;
        this.groupLayer = L.geoJson(geoJSON, {
            //style: support.LayerStyle.choroplethStyle,
            onEachFeature: this.featureSetup
        });
        this._saveFeatures();
    }

    getGroupLayer() {
        return this.groupLayer;
    }

    getLayers() {
        return this.layers;
    }

    featureSetup(feature, layer) {

        function featureSelect() {
            this._lfController.mc_highlightLayer(this._lfId);
        }

        function featureDeselect() {
            this._lfController.mc_resetLayer(this._lfId);
        }

        layer._lfController = new LeafletController();
        layer._lfId = String(layer._leaflet_id);

        layers.set(String(layer._lfId), layer);

        layer.setStyle(support.LayerStyle.choroplethStyle(layer));
        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });
    }

    _saveFeatures() {
        this.layers = layers;
        layers = new Map();  // Cleaning global container to be ready for the next GroupTimeLayer...
    }
}
