import * as glbs from './../../../Globals.js'
import * as support from './Support.js'

import MainController from './../LapsocarteAppController.js'
import LeafletController from './LeafletController.js'
import InfoWidgetController from './InfoWidgetController.js'
import SidebarController from './SidebarController.js'
import TimeController from './TimeController/TimeController.js'

import $ from 'jquery'
import L from'leaflet'
import Typeahead from 'typeahead'

global.jQuery = require('jquery');
require('bootstrap');
require('handlebars');
require('list.js');

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;
let _leafletController;
let _infoWidgetController;
let _sidebarController;
let _timeController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let geometriesMap = null;
let dataMap = null;
let timeVector;

let _currentTime;
let map;
// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let guiController = null; // --> Singleton Pattern...
export default class GUIController {
    constructor() {
        if (!guiController) {
            guiController = this;

            _mainController = new MainController();
            _leafletController = new LeafletController();
            _infoWidgetController = new InfoWidgetController();
            _sidebarController = new SidebarController();
            _timeController = new TimeController();
        }
        return guiController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        _leafletController.mc_initMap();
        map = _leafletController.mc_getMap();
        map.addControl(_infoWidgetController.mc_getLeafletControl());

        _sidebarController.mc_init();

        initLegacy();

        function initLegacy() {
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
        }
    }

    mc_setGeometries(geomMap) {
        geometriesMap = geomMap;
        _leafletController.mc_setGeometries(geometriesMap);

        this._amIready();
    }

    mc_setData(tVector, dMap) {
        timeVector = tVector;
        dataMap = dMap;

        _timeController.mc_setTimeVector(timeVector);
        this._amIready();
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_spatialObjectOver(gid) {
        let color = glbs.PROJECT.FOCUSED_COLOR;
        _leafletController.mc_colorGeometry(gid, color);
        _infoWidgetController.mc_updateInfo(dataMap.get(_currentTime).get(gid));

    }
    sc_spatialObjectOut(gid) {
        this._resetGeometry(gid);
    }

    sc_setTime(newTime) {
        _currentTime = newTime;
        this._resetAllGeometries();
        _sidebarController.mc_syncSidebar();
    }

    sc_getMap() {
        return map;
    }

    sc_getFeatures() {
        try {
            return timeLayers.get(_currentTime).getFeatures();    
        } catch (e) {
            console.log(':! There are not features loaded yet!')
        }
    }

    // Private Methods --------------------------------------------------------
    _resetGeometry(gid) {
        let data = dataMap.get(_currentTime).get(gid)[glbs.PROJECT.COLUMN_DATA];
        let color = glbs.PROJECT.FUNC_DATA2COLOR(data);
        _leafletController.mc_colorGeometry(gid, color);
    }

    _resetAllGeometries() {
        for (let gid of geometriesMap.keys())
            this._resetGeometry(gid);
    }

    _amIready() {
        if (geometriesMap && dataMap) {
            this.sc_setTime(timeVector[0]);
            $("#loading").hide();
            return true;
        }
        return false;
    }
}