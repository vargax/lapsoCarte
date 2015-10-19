import GeotabuladbController from './GeotabuladbController.js'
import SocketioController from './SocketioController.js'
import ExpressController from './ExpressController.js'

const TIME_RANGE = [1,20];      // Tomsa
//const TIME_RANGE = [1,10];    // Lapsocarte

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
        _geotabuladbController.mc_getGeoTimeJsonLayers(TIME_RANGE);
    }

    // GeotabuladbController (gtc) ----------------------------------------------
    gtc_giveGeoTimeJsonLayers(geoTimeJsonLayer) {
        _socketioController.mc_sendGeoTimeJsonLayer(this.tmp, geoTimeJsonLayer);
    }
}