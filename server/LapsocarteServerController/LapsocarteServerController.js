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
let _data = null;
let _geometries = null;

let _clientsDataQueue;
let _clientsGeomQueue;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let lapsocarteServerController = null; // --> Singleton Pattern...
export default class LapsocarteServerController {
    constructor() {
        if (!lapsocarteServerController) {
            lapsocarteServerController = this;

            _databaseController = new DatabaseController();
            _expressController = new ExpressController();
            _socketioController = new SocketioController();
            _dataController = new DataController();

            _clientsDataQueue = [];
            _clientsGeomQueue = [];
        }
        return lapsocarteServerController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_init() {
        _databaseController.mc_init();
        _expressController.mc_init();
        _socketioController.mc_init(_expressController.mc_getServer());
    }

    // Methods exposed my subcontrollers (sc) --------------------------

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