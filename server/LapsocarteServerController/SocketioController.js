import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const INIT       = glbs.SOCKETio_CONSTANTS.INIT,
      GIVE_DATA  = glbs.SOCKETio_CONSTANTS.GIVE_DATA,
      GIVE_GEOM  = glbs.SOCKETio_CONSTANTS.GIVE_GEOM,
      GIVE_STATS = glbs.SOCKETio_CONSTANTS.GIVE_STATS;

const logString = 'socketioController';
const logOK  = ' :: ';

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let _clients;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class SocketioController {
    constructor() {
        _mainController = new MainController();
        _clients = new Map();
    }

    mc_init(server) {
        this._socket = require('socket.io')(server, {path: glbs.PROJECT.PATH+'/socket.io'});
        this._inMsgs();
        _mainController.sc_ready(this);
    }

    mc_sendGeometries(socketId, map) {
        let client = _clients.get(socketId);
        client.emit(GIVE_GEOM,this._map2JSON(map));
    }

    mc_sendData(socketId, map) {
        let client = _clients.get(socketId);
        client.emit(GIVE_DATA,this._map2JSON(map));
    }

    mc_sendStats(socketId, map) {
        let client = _clients.get(socketId);
        client.emit(GIVE_STATS,this._map2JSON(map));
    }

    _map2JSON(map) {
        return JSON.stringify([...map]);
    }

    _inMsgs() {
        this._socket.on('connection', function(socket) {
            console.log(logString+'._inMsgs()'+logOK+' Socket connection from client '+socket.id);

            // Standard socket administration methods:
            if (!_clients.has(socket.id)) {
                console.log('| --> This is a new connection request...');
                _clients.set(socket.id, socket);
            }
            socket.on('disconnect', function() {
                console.log('| --> This is a disconnection request...');
                _clients.delete(socket.id);
            });

            // App specific methods:
            socket.on(INIT, function(msg) {
                console.log('| --> Receiving a '+INIT+' request...');
                _mainController.sc_init(socket.id);
            });
        });
    }
}
