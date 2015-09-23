import GeotabuladbController from './GeotabuladbController.js'
import SocketioController from './SocketioController.js'
import ExpressController from './ExpressController.js'

let _geotabuladbController;
let _expressController;
let _socketioController;

let lapsocarteServerController = null; // --> Singleton Pattern...
export default class LapsocarteServerController {
    constructor() {
        if (!lapsocarteServerController) {
            lapsocarteServerController = this;
        }
        return lapsocarteServerController;
    }

    init() {
        _geotabuladbController = new GeotabuladbController();
        _geotabuladbController.mc_init();

        _expressController = new ExpressController();
        _expressController.mc_init();

        _socketioController = new SocketioController();
        _socketioController.mc_init(_expressController.mc_getServer());
    }

    // ++++++++++++++  CONTROLLER-SPECIFIC FUNCTIONS ++++++++++++++++++++++++//
    // SocketioController (sioc) -----------------------------------------------
    sioc_getMapRequest(socketId) {
        this.tmp = socketId;
        _geotabuladbController.mc_getMap();
    }

    // GeotabuladbController (gtc) ----------------------------------------------
    gtc_giveMap(geoJSON) {
        _socketioController.mc_sendGeoJSON(this.tmp, geoJSON);
    }
}