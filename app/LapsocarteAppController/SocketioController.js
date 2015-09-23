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
        console.log(':: Sending a ' + glbs.GET_MAP + ' request...');
        _socket.emit(glbs.GET_MAP, '');
    }

    // Private methods -----------------------------------------------------------
    _inMsgs () {
        this._socket.on(glbs.ADD_LAYER, function (msg) {
            console.log(':: Receiving a ' + glbs.ADD_LAYER + ' request for t =' + msg[0]);
            _mainController.sioc_addTimeLayer(msg[0],msg[1]);
        });
    }
}
