/*
I am the main controller of the application. I mediate the communication between all controllers. All controllers must register with me and I should know how to manage each controller. Other controllers only need to know how to interact with me.
 */

// ------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------
import LeafletController from './LeafletController.js';
import BootleafController from './BootleafController.js';
import SocketioController from './SocketioController.js';

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const lc_MAP_CENTER = [4.66198, -74.09866];
const lc_MAP_ZOOM = 11;
const lc_MAP_ZOOM_RANGE = [10, 16];

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let leafletController;
let bootleafController;
let socketioController;

let mainController = null; // --> Singleton Pattern...
export default class MainController {
    constructor() {
        if (!mainController) {
            mainController = this;
        }
        return mainController;
    }

    init() {
        leafletController = new LeafletController();

        bootleafController = new BootleafController();
        bootleafController.initGUI();

        socketioController = new SocketioController();
        socketioController.initCOMM();
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) -----------------------------------------------
    sioc_addTimeLayer(time, geoJSON) {
        leafletController.addTimeLayer(time, geoJSON);
        leafletController.setTimeLayer(time);
    }

    // LeafletController (llc) ------------------------------------------------
    llc_getInitialMapParameters() {
        return [lc_MAP_CENTER, lc_MAP_ZOOM, lc_MAP_ZOOM_RANGE];
    }

    // BootleafController (blc) -----------------------------------------------
    blc_getMap() {
        return leafletController.getMap();
    }

}

