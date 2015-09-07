import * as glbs from 'globals.js';
import * as map from 'map.js';

var socket = io();

socket.emit(glbs.GET_MAP, '');

socket.on(glbs.DRAW_MAP, function(msg) {
    console.log(glbs.DRAW_MAP+' request: '+msg);
    map.addLayer(msg);
});

