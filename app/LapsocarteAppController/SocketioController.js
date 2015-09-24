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
        console.log(':: Sending a ' + glbs.GET_LAYERS + ' request...');
        _socket.emit(glbs.GET_LAYERS, '');
    }

    // Private methods -----------------------------------------------------------
    _inMsgs () {
        _socket.on(glbs.ADD_LAYER, function (msg) {
            console.log(':: Receiving a ' + glbs.ADD_LAYER + ' request');
            _mainController.sioc_geoTimeJSONsArrayReceived(msg);
        });
    }
}
