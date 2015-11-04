/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */
import GUIController from './GUIController/GUIController.js';
import SocketioController from './SocketioController.js';
import DataController from './DataController.js';

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _guiController;
let _socketioController;
let _dataController;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let lapsocarteAppController = null; // --> Singleton Pattern...
export default class LapsocarteAppController {
    constructor() {
        if (!lapsocarteAppController) {
            lapsocarteAppController = this;

            _guiController = new GUIController();
            _dataController = new DataController();
            _socketioController = new SocketioController();

        }
        return lapsocarteAppController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    init() {
        _socketioController.mc_initCOMM();
        _guiController.mc_initGUI();
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_geomReceived(geoJSON) {
        _dataController.mc_registerGeometries(geoJSON);
        _guiController.mc_setGeometries(_dataController.mc_getGeometries());
    }

    sc_dataReceived(json) {
        _dataController.mc_registerData(json);
        let tVector = _dataController.mc_getTimeVector();
        let dMap = _dataController.mc_getData();
        _guiController.mc_setData(tVector,dMap);
    }

    sc_descriptiveStatsReceived(object) {
        _dataController.mc_registerDescriptiveStats(object);
    }
}
