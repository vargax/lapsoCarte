import GeotabuladbController from './GeotabuladbController.js'
import SocketioController from './SocketioController.js'
import ExpressController from './ExpressController.js'
import * as glbs from '../../Globals.js'

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _geotabuladbController;
let _expressController;
let _socketioController;

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

            _geotabuladbController = new GeotabuladbController();
            _expressController = new ExpressController();
            _socketioController = new SocketioController();

            _clientsDataQueue = [];
            _clientsGeomQueue = [];
        }
        return lapsocarteServerController;
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_init() {
        _geotabuladbController.mc_init();
        _expressController.mc_init();
        _socketioController.mc_init(_expressController.mc_getServer());
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_init(socketId) {
        if (_data) _socketioController.mc_sendData(socketId,_data);
        else {
            _geotabuladbController.mc_getData();
            _clientsDataQueue.push(socketId);
        }

        if (_geometries) _socketioController.mc_sendGeometries(socketId,_geometries);
        else {
            _geotabuladbController.mc_getGeometries();
            _clientsGeomQueue.push(socketId);
        }
    }

    sc_giveData(json) {
        _data = json;
        console.log('serverController.sc_giveData() :: '+_data.length+' data elements retrieved...');

        let client = _clientsDataQueue.shift();
        while(client != undefined) {
            _socketioController.mc_sendData(client,_data);
            client = _clientsDataQueue.shift();
        }
    }

    sc_giveGeometries(geoJSON) {
        _geometries = geoJSON;
        console.log('serverController.sc_giveGeometries() :: '+_geometries['features'].length+' geometries retrieved...');
        //console.dir(_geometries['features']);

        let client = _clientsGeomQueue.shift();
        while(client != undefined) {
            _socketioController.mc_sendGeometries(client,_geometries);
            client = _clientsGeomQueue.shift();
        }
    }
}