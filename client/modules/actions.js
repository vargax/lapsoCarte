import * as glbs from 'lapsocarte/client/globals.js';
import * as map from 'lapsocarte/client/map.js';
import io from 'socket.io-client';

var socket = io();

socket.on(glbs.ADD_LAYER, function (msg) {
    console.log(':: Receiving a ' + glbs.ADD_LAYER + ' request for t =' + msg[0]);
    map.addTimeLayer(msg[0], msg[1]);
});

function init() {
    console.log(':: Sending a ' + glbs.GET_MAP + ' request...');
    socket.emit(glbs.GET_MAP, '');
}

module.exports = {
    init: init
};