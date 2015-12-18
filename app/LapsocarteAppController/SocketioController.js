import io from 'socket.io-client';

import MainController from './LapsocarteAppController.js'
import * as glbs from './../../Globals.js';

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const INIT       = glbs.SOCKETio_CONSTANTS.INIT,
      GIVE_DATA  = glbs.SOCKETio_CONSTANTS.GIVE_DATA,
      GIVE_GEOM  = glbs.SOCKETio_CONSTANTS.GIVE_GEOM,
      GIVE_STATS = glbs.SOCKETio_CONSTANTS.GIVE_STATS;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let _socket;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class SocketioController {
    constructor() {
        _mainController = new MainController();
        _socket = io(undefined, {path: glbs.PROJECT.PATH+'/socket.io'});
        this._inMsgs();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_initCOMM() {
        console.log('socketioController.mc_initCOMM() :: Sending a ' + INIT + ' message...');
        _socket.emit(INIT, '');
    }

    // Private methods -----------------------------------------------------------
    _inMsgs () {
        _socket.on(GIVE_DATA, function (msg) {
            console.log('socketioController._inMsgs() :: Receiving a ' + GIVE_DATA + ' message...');
            _mainController.sc_dataReceived(msg);
        });
        _socket.on(GIVE_STATS, function (msg) {
            console.log('socketioController._inMsgs() :: Receiving a ' + GIVE_STATS + ' message...');
            _mainController.sc_descriptiveStatsReceived(msg);
        });
        _socket.on(GIVE_GEOM, function (msg) {
            console.log('socketioController._inMsgs() :: Receiving a ' + GIVE_GEOM + ' message...');
            _mainController.sc_geomReceived(msg);
        });
    }
}
