import MainController from './MainController.js'
import * as glbs from './globals.js';

import io from 'socket.io-client';

let mainController;


export default class SocketioController {
    constructor() {
        mainController = new MainController();
        this._socket = io();
        this._inMsgs();
    }

    initCOMM() {
        console.log(':: Sending a ' + glbs.GET_MAP + ' request...');
        this._socket.emit(glbs.GET_MAP, '');
    }

    _inMsgs () {
        this._socket.on(glbs.ADD_LAYER, function (msg) {
            console.log(':: Receiving a ' + glbs.ADD_LAYER + ' request for t =' + msg[0]);
            mainController.sioc_addTimeLayer(msg[0],msg[1]);
        });
    }
}
