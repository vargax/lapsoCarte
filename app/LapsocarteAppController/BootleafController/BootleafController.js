import MainController from './../LapsocarteAppController.js'
import LeafletController from './LeafletController.js'
import SidebarController from './SidebarController.js'
import TimeController from './TimeController/TimeController.js'
import * as support from './Support.js';

import $ from 'jquery';
import L from'leaflet';
import Typeahead from 'typeahead'

global.jQuery = require('jquery');
require('bootstrap');
require('handlebars');
require('list.js');

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const lc_MAP_CENTER = [4.66198, -74.09866];
const lc_MAP_ZOOM = 11;
const lc_MAP_ZOOM_RANGE = [10, 16];

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;
let _leafletController;
let _sidebarController;
let _timeController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let timeLayers;
let _currentTime;
let _timeVector;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let bootleafController = null; // --> Singleton Pattern...
export default class BootleafController {
    constructor() {
        if (!bootleafController) {
            bootleafController = this;

            _mainController = new MainController();
            _leafletController = new LeafletController();
            _sidebarController = new SidebarController();
            _timeController = new TimeController();
        }
        return bootleafController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        $("#about-btn").click(function() {
            $("#aboutModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#full-extent-btn").click(function() {
            _map.fitBounds(boroughs.getBounds());
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#legend-btn").click(function() {
            $("#legendModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#login-btn").click(function() {
            $("#loginModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#list-btn").click(function() {
            $('#sidebar').toggle();
            _map.invalidateSize();
            return false;
        });

        $("#nav-btn").click(function() {
            $(".navbar-collapse").collapse("toggle");
            return false;
        });

        $("#sidebar-toggle-btn").click(function() {
            $("#sidebar").toggle();
            _map.invalidateSize();
            return false;
        });

        $("#sidebar-hide-btn").click(function() {
            $('#sidebar').hide();
            _map.invalidateSize();
        });

        $("#loading").hide();
    }

    mc_setGeoTimeData(geoTimeJSONsMap, timeVector) {
        timeLayers = new Map();
        _timeVector = timeVector;

        for (let [t, geoJSON] of geoTimeJSONsMap) {
            let timeLayer = new TimeLayer(t, geoJSON);
            timeLayers.set(t, timeLayer);
        }

        _leafletController.mc_setTimeLayers(timeLayers);
        _timeController.mc_setTimeVector(_timeVector);

        this.sc_setTime(_timeVector[0]);
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_featureOver(featureId) {
        _leafletController.mc_highlightFeature(featureId);
    }
    sc_featureOut(featureId) {
        _leafletController.mc_resetFeature(featureId);
    }
    sc_setTime(newTime) {
        _currentTime = newTime;
        _leafletController.mc_setTime(_currentTime);
        _sidebarController.mc_syncSidebar();
    }

    sc_getMap() {
        return _leafletController.mc_getMap();
    }
    // LeafletController (llc) ------------------------------------------------
    static llc_getInitialMapParameters() {
        return [lc_MAP_CENTER, lc_MAP_ZOOM, lc_MAP_ZOOM_RANGE];
    }

    // SidebarController (sbc) ------------------------------------------------
    sbc_getFeatures() {
        try {
            return timeLayers.get(_currentTime).getFeatures();    
        } catch (e) {
            console.log(':! There are not features loaded yet!')
        }
    }
}

let features = new Map();
class TimeLayer {
    constructor(time, geoJSON) {
        this.time = time;
        this.layer = L.geoJson(geoJSON, {
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

    getFeature(featureId) {
        return this.features.get(featureId);
    }

    featureSetup(feature, layer) {

        layer._blController = new BootleafController();
        layer._lfId = String(layer._leaflet_id);

        features.set(layer._lfId, layer);

        layer.setStyle(support.LayerStyle.choroplethStyle(layer));
        layer.on({
            mouseover: featureSelect,
            mouseout: featureDeselect
        });

        function featureSelect() {
            this._blController.sc_featureOver(this._lfId);
        }

        function featureDeselect() {
            this._blController.sc_featureOut(this._lfId);
        }
    }

    _saveFeatures() {
        this.features = features;
        features = new Map();  // Cleaning global container to be ready for the next TimeLayer...
    }
}