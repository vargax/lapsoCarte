/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */
import BootleafController from './BootleafController/BootleafController.js';
import SocketioController from './SocketioController.js';
import DataController from './DataController.js';

let _bootleafController;
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
        _bootleafController = new BootleafController();
        _bootleafController.mc_initGUI();

        _socketioController = new SocketioController();
        _socketioController.mc_initCOMM();

        _dataController = new DataController();
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) -----------------------------------------------
    sioc_addTimeLayer(time, geoJSON) {
        _bootleafController.mc_addTimeGroupLayer(time, geoJSON);
    }

    // BootleafController (blc) -----------------------------------------------

}


