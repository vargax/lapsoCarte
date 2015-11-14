import DatabaseController from './DatabaseController.js'
import SocketioController from './SocketioController.js'
import ExpressController from './ExpressController.js'
import DataController from './DataController.js'
import * as glbs from '../../Globals.js'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const WHEREs_MAP =   glbs.DATA_CONSTANTS.WHEREs_MAP;
const DATA_MAP = glbs.DATA_CONSTANTS.DATA_MAP;
const DESC_STATS = glbs.DATA_CONSTANTS.DESCRIPTIVE_STATS;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _databaseController;
let _expressController;
let _socketioController;
let _dataController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let _notReady = 0;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let lapsocarteServerController = null; // --> Singleton Pattern...
export default class LapsocarteServerController {
    constructor() {
        if (!lapsocarteServerController) {
            lapsocarteServerController = this;

            _databaseController = new DatabaseController(); _notReady++;
            _expressController  = new ExpressController();  _notReady++;
            _socketioController = new SocketioController(); _notReady++;
            _dataController     = new DataController();     _notReady++;

        }
        return lapsocarteServerController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_init() {
        _databaseController.mc_init();
    }

    // Methods exposed my subcontrollers (sc) --------------------------
    sc_ready(controller) {
        switch (controller) {
            case _databaseController:
                _notReady--;
                console.log("_databaseController ready! "+_notReady+" controllers pending...");
                break;

            case _dataController:
                _notReady--;
                console.log("_dataController ready! "+_notReady+" controllers pending...");
                _expressController.mc_init();
                break;

            case _expressController:
                _notReady--;
                console.log("_expressController ready! "+_notReady+" controllers pending...");
                _socketioController.mc_init(_expressController.mc_getServer());
                break;

            case _socketioController:
                _notReady--;
                console.log("_socketioController ready! "+_notReady+" controllers pending...");
                break;
        }
    }

    // Used by _socketioController
    sc_init(socketId) {
        _socketioController.mc_sendData(socketId, glbs.PROJECT[DATA_MAP]);
        _socketioController.mc_sendStats(socketId, glbs.PROJECT[DESC_STATS]);
        _socketioController.mc_sendGeometries(socketId, glbs.PROJECT[WHEREs_MAP]);
    }

    // Used by _databaseController
    sc_giveWheres(geoJSON) {
        _dataController.mc_setWheres(geoJSON);
    }

    sc_giveData(json) {
        _dataController.mc_setData(json);
    }
}