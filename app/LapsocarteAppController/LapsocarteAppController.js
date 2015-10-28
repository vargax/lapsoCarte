/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */
import GUIController from './GUIController/GUIController.js';
import SocketioController from './SocketioController.js';
import DataController from './DataController.js';

let _guiController;
let _socketioController;
let _dataController;

let lapsocarteAppController = null; // --> Singleton Pattern...
export default class LapsocarteAppController {
    constructor() {
        if (!lapsocarteAppController) {
            lapsocarteAppController = this;
        }
        return lapsocarteAppController;
    }

    init() {
        _guiController = new GUIController();
        _guiController.mc_initGUI();

        _socketioController = new SocketioController();
        _socketioController.mc_initCOMM();

        _dataController = new DataController();
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) ----------------------------------------------
    sioc_geoTimeJSONsArrayReceived(geoTimeJSONsArray) {
        _dataController.mc_geoTimeJSONsRegister(geoTimeJSONsArray);
        let geoTimeJSONsMap = _dataController.mc_getGeoTimeJSONsMap();
        let timeVector = _dataController.mc_getTimeVector();

        _guiController.mc_setGeoTimeData(geoTimeJSONsMap, timeVector);
    }
}
