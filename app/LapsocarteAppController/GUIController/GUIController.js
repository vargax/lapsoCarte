import * as glbs from './../../../Globals.js'
import * as support from './Support.js'

import MainController from './../LapsocarteAppController.js'
import LeafletController from './LeafletController.js'
import InfoWidgetController from './InfoWidgetController.js'
import DOMController from './DOMController.js'
import SliderController from './SliderController.js'

import $ from 'jquery'
import L from'leaflet'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const INSTANCE      = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.INSTANCE,

      CURRENT_HOW   = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_HOW,
      CURRENT_WHAT  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_WHAT,
      CURRENT_WHEN  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_WHEN,

      DATA_MAP      = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.DATA_MAP,
      WHAT_STATS    = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.WHAT_STATS,
      WHEN_STATS    = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.WHEN_STATS,

      LEAFLET_MAP   = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.LEAFLET_MAP;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

let _leafletController;
let _infoWidgetController;
let _domController;
let _sliderController;

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

            _leafletController    = new LeafletController();    _notReady++;
            _infoWidgetController = new InfoWidgetController(); _notReady++;
            _domController        = new DOMController();        _notReady++;
            _sliderController     = new SliderController();     _notReady++;
        }
        return guiController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_initGUI() {
        _leafletController.mc_initMap();
        let leafletMap = instance[LEAFLET_MAP];
        leafletMap.addControl(_infoWidgetController.mc_getLeafletControl());

        _domController.mc_initDOM();
        _sliderController.mc_initSlider();
    }

    mc_loadGeometries() {
        geometriesMap = glbs.PROJECT[glbs.DATA_CONSTANTS.WHEREs_MAP];
        _leafletController.mc_loadGeometries();
    }

    mc_loadData() {
        instance[CURRENT_HOW] = null;
        instance[CURRENT_WHAT] = null;
        instance[CURRENT_WHEN] = null;
        instance[DATA_MAP] = null;

        _domController.mc_setHows(Array.from(
            glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP]
                .keys()
        ));
    }

    mc_loadStats() {
        instance[WHAT_STATS] = null;
        instance[WHEN_STATS] = null;
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_howChange(newHow) {
        instance[CURRENT_HOW] = newHow;
        instance[CURRENT_WHAT] = null;
        instance[CURRENT_WHEN] = null;
        instance[DATA_MAP] = null;

        instance[WHAT_STATS] = null;
        instance[WHEN_STATS] = null;

        this._resetAllGeometries();
        _domController.mc_setWhats(Array.from(
            glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP]
                .get(instance[CURRENT_HOW])
                .keys()
        ));
    }

    sc_whatChange(newWhat) {
        instance[CURRENT_WHAT] = newWhat;
        instance[CURRENT_WHEN] = null;
        instance[DATA_MAP] = null;

        instance[WHAT_STATS] =
            glbs.PROJECT[glbs.DATA_CONSTANTS.DESCRIPTIVE_STATS]
                .get(instance[CURRENT_HOW])
                .get(instance[CURRENT_WHAT]);
        instance[WHEN_STATS] = null;

        this._resetAllGeometries();
        _sliderController.mc_update(Array.from(
            glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP]
                .get(instance[CURRENT_HOW])
                .get(instance[CURRENT_WHAT])
                .keys()
        ));
    }

    sc_whenChange(newWhen) {
        instance[CURRENT_WHEN] = newWhen;

        instance[WHEN_STATS] =
            instance[WHAT_STATS]
                .get(instance[CURRENT_WHEN]);

        instance[DATA_MAP] =
            glbs.PROJECT[glbs.DATA_CONSTANTS.DATA_MAP]
                .get(instance[CURRENT_HOW])
                .get(instance[CURRENT_WHAT])
                .get(instance[CURRENT_WHEN]);

        this._resetAllGeometries();
        _infoWidgetController.mc_updateInfo();
    }

    sc_spatialObjectOver(gid) {
        let color = glbs.PROJECT.FOCUSED_COLOR;

        _leafletController.mc_colorGeometry(gid, color);

        let info = geometriesMap.get(gid)['properties'];
        if(instance[DATA_MAP]) {
            info[glbs.PROJECT.COLUMN_WHEN] = instance[CURRENT_WHEN];
            info[instance[CURRENT_WHAT]] = instance[DATA_MAP].get(gid);
        }
        _infoWidgetController.mc_updateInfo(info);
    }

    sc_spatialObjectOut(gid) {
        try {
            _infoWidgetController.mc_updateInfo();
            this._resetGeometry(gid);
        } catch (e) {
            console.log(e);
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

            case _sliderController:
                _notReady--;
                console.log(log+"SliderController ready! "+_notReady+" controllers pending...");
                break;

            case _domController:
                _notReady--;
                console.log(log+"DOMController ready! "+_notReady+" controllers pending...");
                break;
        }
        if (_notReady == 0) {
            this.sc_whenChange();
            _mainController.sc_ready(this);
        }
    }

    // Private Methods --------------------------------------------------------
    _resetGeometry(gid) {
        let dataMap = instance[DATA_MAP];

        if (!dataMap) {
            let color = glbs.PROJECT.DEFAULT_STYLE.color;
            _leafletController.mc_colorGeometry(gid, color);
            return;
        }

        let data, color, error;
        try {
            data = dataMap.get(gid);
            color = glbs.PROJECT.FUNC_DATA2COLOR(data);
        } catch (e) {
            color = glbs.PROJECT.DEFAULT_STYLE.color;
            error = {
                message: 'GUIController._resetGeometry()!: No data for '+gid+' in t='+instance[CURRENT_WHEN],
                exception: e
            };
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
                noData.push({
                    where: gid,
                    error: e
                });
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