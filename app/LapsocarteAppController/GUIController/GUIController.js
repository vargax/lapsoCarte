import * as glbs from './../../../Globals.js'
import * as support from './Support.js'

import MainController from './../LapsocarteAppController.js'
import LeafletController from './LeafletController.js'
import InfoWidgetController from './InfoWidgetController.js'
import TimeController from './TimeController/TimeController.js'

import $ from 'jquery'
import L from'leaflet'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const INSTANCE      = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.INSTANCE,

      CURRENT_HOW   = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_HOW,
      CURRENT_WHAT  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_WHAT,
      CURRENT_WHEN  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_WHEN,
      WHENs_VECTOR  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.WHENs_VECTOR,
      DATA_MAP      = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.DATA_MAP,
      LEAFLET_MAP   = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.LEAFLET_MAP;

// ToDo put this on globals and compile the index.html using Handlebars
const HOWs_CONTAINER = '#lpc-hows-selector-container';
const WHATs_CONTAINER = '#lpc-whats-selector-container';


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
let instance;

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

            instance = {};
            instance[INSTANCE] = this;
            const INSTANCE_KEY = glbs.DATA_CONSTANTS.LPC_INSTANCE_KEY;
            glbs.PROJECT[INSTANCE_KEY] = instance;

            _leafletController = new LeafletController();       _notReady++;
            _infoWidgetController = new InfoWidgetController(); _notReady++;
            _timeController = new TimeController();             _notReady++;
        }
        return guiController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        _leafletController.mc_initMap();
        let leafletMap = instance[LEAFLET_MAP];
        leafletMap.addControl(_infoWidgetController.mc_getLeafletControl());
    }

    mc_loadGeometries() {
        geometriesMap = glbs.PROJECT[glbs.DATA_CONSTANTS.WHEREs_MAP];
        _leafletController.mc_loadGeometries();
    }

    mc_loadData() {
        let globalDataMap = glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP];

        instance[CURRENT_HOW] = null;
        instance[CURRENT_WHAT] = null;
        instance[CURRENT_WHEN] = null;
        instance[WHENs_VECTOR] = null;
        instance[DATA_MAP] = null;

        let hows = Array.from(globalDataMap.keys());
        let howsSelect = support.HandlebarsHelper.compileSelect(hows);

        let howsContainer = $(HOWs_CONTAINER);
        howsContainer.append(howsSelect);

        howsContainer.on({
            change: function(){
                let newHow = $(this).val();
                let guiController = new GUIController();
                guiController.sc_howChange(newHow);
            }
        }, 'select');
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_howChange(newHow) {
        let globalDataMap = glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP];

        instance[CURRENT_HOW] = newHow;
        instance[CURRENT_WHAT] = null;
        instance[CURRENT_WHEN] = null;
        instance[WHENs_VECTOR] = null;
        instance[DATA_MAP] = null;

        this._resetAllGeometries();

        let whats = Array.from(globalDataMap.get(newHow).keys());
        let whatsSelect = support.HandlebarsHelper.compileSelect(whats);

        let whatsContainer = $(WHATs_CONTAINER);
        whatsContainer.append(whatsSelect);

        whatsContainer.on({
            change: function(){
                let newWhat = $(this).val();
                let guiController = new GUIController();
                guiController.sc_whatChange(newWhat);
            }
        }, 'select');
    }

    sc_whatChange(newWhat) {
        let globalDataMap = glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP];

        let currentHow = instance[CURRENT_HOW];
        let dataMap = globalDataMap.get(currentHow).get(newWhat);

        let whensVector = Array.from(dataMap.keys());

        instance[CURRENT_WHAT] = newWhat;
        instance[WHENs_VECTOR] = whensVector;
        instance[CURRENT_WHEN] = null;
        instance[DATA_MAP] = dataMap;

        _timeController.mc_loadTimeVector();
    }

    sc_spatialObjectOver(gid) {
        let dataMap = instance[DATA_MAP];

        let color = glbs.PROJECT.FOCUSED_COLOR;
        let currentTime = instance[CURRENT_WHEN];

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
            this._resetAllGeometries();
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
        let currentTime = instance[CURRENT_WHEN];
        let dataMap = instance[DATA_MAP];

        let data, color, error;
        try {
            data = dataMap.get(currentTime).get(gid);
            color = glbs.PROJECT.FUNC_DATA2COLOR(data);
        } catch (e) {
            color = glbs.PROJECT.DEFAULT_STYLE.color;
            error = 'GUIController._resetGeometry()!: No data for '+gid+' in t='+currentTime;
            console.dir(e)
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
            let currentTime = instance[CURRENT_WHEN];
            console.log('GUIController._resetAllGeometries()!: No '+glbs.PROJECT.COLUMN_DATA
                +' data for '+noData.length+' geometries in '+currentTime+'!');
            console.dir(noData);
        }
    }
}