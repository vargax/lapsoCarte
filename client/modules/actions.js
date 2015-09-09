import * as glbs from 'modules/globals.js';
import * as map from 'modules/map.js';
import io from 'socket.io-client';

var socket = io();

socket.on(glbs.DRAW_MAP, function (msg) {
    console.log(':: Receiving a ' + glbs.DRAW_MAP + ' request ' + msg);
    map.addLayer(msg);
});

function init() {
    console.log(':: Sending a ' + glbs.GET_MAP + ' request...');
    socket.emit(glbs.GET_MAP, '');
}

module.exports = {
    init: init
};