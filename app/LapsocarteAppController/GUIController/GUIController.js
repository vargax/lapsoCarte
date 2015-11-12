import * as glbs from './../../../Globals.js'
import * as support from './Support.js'

import MainController from './../LapsocarteAppController.js'
import LeafletController from './LeafletController.js'
import InfoWidgetController from './InfoWidgetController.js'
import TimeController from './TimeController/TimeController.js'

import $ from 'jquery'
import L from'leaflet'

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

let _leafletController;
let _infoWidgetController;
let _timeController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let geometriesMap;
let dataMap;

let _notReady = 0;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let guiController = null; // --> Singleton Pattern...
export default class GUIController {
    constructor() {
        if (!guiController) {
            guiController = this;

            _mainController = new MainController();

            _leafletController = new LeafletController();       _notReady++;
            _infoWidgetController = new InfoWidgetController(); _notReady++;
            _timeController = new TimeController();             _notReady++;
        }
        return guiController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        _leafletController.mc_initMap();
        let leafletMap = glbs.PROJECT[glbs.DATA_CONSTANTS.LEAFLET_MAP];
        leafletMap.addControl(_infoWidgetController.mc_getLeafletControl());
    }

    mc_loadGeometries() {
        geometriesMap = glbs.PROJECT[glbs.DATA_CONSTANTS.WHEREs_MAP];
        _leafletController.mc_loadGeometries();
    }

    mc_loadData() {
        dataMap = glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP];

        let hows = glbs.PROJECT[glbs.DATA_CONSTANTS.HOWs_VECTOR];
        let howsSelect = support.HandlebarsHelper.compileSelect(hows);
        $('#lpc-hows-selector').append(howsSelect);

        //_timeController.mc_loadTimeVector();
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_spatialObjectOver(gid) {
        let color = glbs.PROJECT.FOCUSED_COLOR;
        let currentTime = glbs.PROJECT[glbs.DATA_CONSTANTS.CURRENT_TIME];

        _leafletController.mc_colorGeometry(gid, color);
        let data = Object.assign(geometriesMap.get(gid)['properties'], dataMap.get(currentTime).get(gid));
        _infoWidgetController.mc_updateInfo(data);
    }

    sc_spatialObjectOut(gid) {
        try {
            _infoWidgetController.mc_updateInfo();
            this._resetGeometry(gid);
        } catch (e) {
            console.log(e);
        }
    }

    sc_timeChange() {
        try {
            this._resetAllGeometries()
            _infoWidgetController.mc_updateInfo();
        } catch (e) {
            console.log("GUIController.sc_timeChange() !: I can not change time now... Maybe I'm not ready yet...");
            console.dir(e);
        }
    }

    sc_ready(controller) {
        let log = "GUIController.sc_ready() :: ";
        switch (controller) {
            case _leafletController:
                _notReady--;
                console.log(log+"LeafletController ready! "+_notReady+" controllers pending...");
                break;

            case _infoWidgetController:
                _notReady--;
                console.log(log+"InfoWidgetController ready! "+_notReady+" controllers pending...");
                break;

            case _timeController:
                _notReady--;
                console.log(log+"TimeController ready! "+_notReady+" controllers pending...");
                break;
        }
        if (_notReady == 0) {
            this.sc_timeChange();
            _mainController.sc_ready(this);
        }
    }

    // Private Methods --------------------------------------------------------
    _resetGeometry(gid) {
        let currentTime = glbs.PROJECT[glbs.DATA_CONSTANTS.CURRENT_TIME];
        let data, color, error;
        try {
            data = dataMap.get(currentTime).get(gid)[glbs.PROJECT.COLUMN_DATA];
            color = glbs.PROJECT.FUNC_DATA2COLOR(data);
        } catch (e) {
            color = glbs.PROJECT.DEFAULT_STYLE.color;
            error = 'GUIController._resetGeometry()!: No data for '+gid+' in t='+currentTime;
        }
        _leafletController.mc_colorGeometry(gid, color);

        if (error != undefined) throw error;
    }

    _resetAllGeometries() {
        let noData = [];
        for (let gid of geometriesMap.keys()) {
            try {
                this._resetGeometry(gid);
            } catch (e) {
                noData.push(gid);
            }
        }
        if (noData.length != 0) {
            let currentTime = glbs.PROJECT[glbs.DATA_CONSTANTS.CURRENT_TIME];
            console.log('GUIController._resetAllGeometries()!: No '+glbs.PROJECT.COLUMN_DATA
                +' data for '+noData.length+' geometries in '+currentTime+'!');
            console.dir(noData);
        }

    }
}