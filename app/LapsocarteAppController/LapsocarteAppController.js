/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */
import BootleafController from './BootleafController/BootleafController.js';
import SocketioController from './SocketioController.js';
import DataController from './DataController.js';

let lapsocarteAppController = null; // --> Singleton Pattern...
export default class LapsocarteAppController {
    constructor() {
        if (!lapsocarteAppController) {
            lapsocarteAppController = this;
        }
        return lapsocarteAppController;
    }

    init() {
        this.bootleafController = new BootleafController();
        this.bootleafController.mc_initGUI();

        this._socketioController = new SocketioController();
        this._socketioController.mc_initCOMM();

        this.dataController = new DataController();
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) -----------------------------------------------
    sioc_addTimeLayer(time, geoJSON) {
        this.bootleafController.mc_addTimeGroupLayer(time, geoJSON);
    }

    // BootleafController (blc) -----------------------------------------------

}


