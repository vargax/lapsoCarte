import io from 'socket.io-client';

import MainController from './LapsocarteAppController.js'
import * as glbs from './../../Globals.js';

let _mainController;
let _socket;

export default class SocketioController {
    constructor() {
        _mainController = new MainController();
        _socket = io();
        this._inMsgs();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_initCOMM() {
        console.log(':: Sending a ' + glbs.INIT + ' message...');
        _socket.emit(glbs.INIT, '');
    }

    // Private methods -----------------------------------------------------------
    _inMsgs () {
        _socket.on(glbs.GIVE_DATA, function (msg) {
            console.log(':: Receiving a ' + glbs.GIVE_DATA + ' message...');
            _mainController.sc_dataReceived(msg);
        });
        _socket.on(glbs.GIVE_GEOM, function (msg) {
            console.log(':: Receiving a ' + glbs.GIVE_GEOM + ' message...');
            _mainController.sc_geomReceived(msg);
        });
    }
}
