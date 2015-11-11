import DatabaseController from './DatabaseController.js'
import SocketioController from './SocketioController.js'
import ExpressController from './ExpressController.js'
import DataController from './DataController.js'
import * as glbs from '../../Globals.js'

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
            _expressController = new ExpressController();   _notReady++;
            _socketioController = new SocketioController(); _notReady++;
            _dataController = new DataController();         _notReady++;

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

    }

    // Used by _databaseController
    sc_giveHows(json) {
        _dataController.mc_setHows(json);
    }

    sc_giveWhats(json) {
        _dataController.mc_setWhats(json);
    }

    sc_giveWhens(json) {
        _dataController.mc_setWhens(json);
    }
    
    sc_giveWheres(geoJSON) {
        _dataController.mc_setWheres(geoJSON);
    }

    sc_giveData(json) {
        _dataController.mc_setData(json);
    }
}