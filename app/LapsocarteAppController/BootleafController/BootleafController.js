import MainController from './../LapsocarteAppController.js';
import LeafletController from './LeafletController.js';
import SidebarController from './SidebarController.js';

import $ from 'jquery';
import Typeahead from 'typeahead';

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
// VARIABLES
// ------------------------------------------------------------------------
let _mainController;
let _leafletController;
let _sidebarController;
let _map;

let bootleafController = null; // --> Singleton Pattern...
export default class BootleafController {
    constructor() {
        if (!bootleafController) {
            bootleafController = this;

            _mainController = new MainController();
            _leafletController = new LeafletController();
            _sidebarController = new SidebarController();

            _map = _leafletController.mc_getMap();
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

    mc_addTimeGroupLayer(time, geoJSON) {
        _leafletController.mc_addTimeGroupLayer(time, geoJSON);
        _leafletController.mc_setTimeGroupLayer(time);
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_featureOver(featureId) {
        _leafletController.mc_highlightLayer(featureId);
    }
    sc_featureOut(featureId) {
        _leafletController.mc_resetLayer(featureId);
    }

    // LeafletController (llc) ------------------------------------------------
    static llc_getInitialMapParameters() {
        return [lc_MAP_CENTER, lc_MAP_ZOOM, lc_MAP_ZOOM_RANGE];
    }

    // SidebarController (sbc) ------------------------------------------------
    sbc_getMap() {
        return _leafletController.mc_getMap();
    }
    sbc_getFeatures() {
        return _leafletController.mc_getCurrentLayer().getLayers();
    }
}