'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _globalsJs = require('globals.js');

var glbs = _interopRequireWildcard(_globalsJs);

var _mapJs = require('map.js');

var map = _interopRequireWildcard(_mapJs);

var socket = io();

socket.emit(glbs.GET_MAP, '');

socket.on(glbs.DRAW_MAP, function (msg) {
    console.log(glbs.DRAW_MAP + ' request: ' + msg);
    map.addLayer(msg);
});

//# sourceMappingURL=actions.js.map