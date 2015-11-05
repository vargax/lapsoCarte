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

    sc_ready(controller) {
        let log = "LapsocarteAppController.sc_ready() :: ";
        switch (controller) {
            case _dataController:
                let tVector = _dataController.mc_getTimeVector();
                let dMap = _dataController.mc_getData();
                let dStats = _dataController.mc_getDescriptiveStats();
                _guiController.mc_loadData(tVector,dMap,dStats);

                console.log(log+"DataController ready!");
                break;

            case _guiController:
                console.log(log+"GUIController ready!");
                break;
        }
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_geomReceived(geoJSON) {
        _dataController.mc_registerGeometries(geoJSON);
        _guiController.mc_loadGeometries();
    }

    sc_dataReceived(json) {
        _dataController.mc_registerData(json);
    }

    sc_descriptiveStatsReceived(object) {
        _dataController.mc_registerDescriptiveStats(object);
    }
}
