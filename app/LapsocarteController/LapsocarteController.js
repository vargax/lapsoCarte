/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */

// ------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------
import BootleafController from './BootleafController/BootleafController.js';
import SocketioController from './SocketioController.js';

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let bootleafController;
let socketioController;

let lapsocarteController = null; // --> Singleton Pattern...
export default class LapsocarteController {
    constructor() {
        if (!lapsocarteController) {
            lapsocarteController = this;
        }
        return lapsocarteController;
    }

    init() {
        bootleafController = new BootleafController();
        bootleafController.mc_initGUI();

        socketioController = new SocketioController();
        socketioController.mc_initCOMM();
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) -----------------------------------------------
    sioc_addTimeLayer(time, geoJSON) {
        bootleafController.mc_addTimeLayer(time, geoJSON);
    }

    // BootleafController (blc) -----------------------------------------------

}


