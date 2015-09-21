import MainController from './../LapsocarteController.js';
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
let mainController;
let leafletController;
let sidebarController;
let map;

let bootleafController = null; // --> Singleton Pattern...
export default class BootleafController {
    constructor() {
        if (!bootleafController) {
            bootleafController = this;

            mainController = new MainController();
            leafletController = new LeafletController();
            sidebarController = new SidebarController();

            map = leafletController.mc_getMap();
        }
        return bootleafController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        $(window).resize(function() {
            sizeLayerControl();
        });

        $("#about-btn").click(function() {
            $("#aboutModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#full-extent-btn").click(function() {
            map.fitBounds(boroughs.getBounds());
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
            map.invalidateSize();
            return false;
        });

        $("#nav-btn").click(function() {
            $(".navbar-collapse").collapse("toggle");
            return false;
        });

        $("#sidebar-toggle-btn").click(function() {
            $("#sidebar").toggle();
            map.invalidateSize();
            return false;
        });

        $("#sidebar-hide-btn").click(function() {
            $('#sidebar').hide();
            map.invalidateSize();
        });

        $("#loading").hide();
    }

    mc_addTimeGroupLayer(time, geoJSON) {
        leafletController.mc_addTimeGroupLayer(time, geoJSON);
        leafletController.mc_setTimeGroupLayer(time);
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_featureOver(featureId) {
        leafletController.mc_highlightLayer(featureId);
    }
    sc_featureOut(featureId) {
        leafletController.mc_resetLayer(featureId);
    }

    // LeafletController (llc) ------------------------------------------------
    static llc_getInitialMapParameters() {
        return [lc_MAP_CENTER, lc_MAP_ZOOM, lc_MAP_ZOOM_RANGE];
    }

    // SidebarController (sbc) ------------------------------------------------
    sbc_getMap() {
        return leafletController.mc_getMap();
    }
    sbc_getFeatures() {
        return leafletController.mc_getCurrentLayer().getLayers();
    }
}