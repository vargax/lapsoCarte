import * as glbs from 'lapsocarte/client/globals.js';
import * as map from 'lapsocarte/client/map.js';
import * as actions from 'lapsocarte/client/actions.js';

import c3 from 'c3';

const CENTER = [4.66198, -74.09866];
const ZOOM = 11;
const ZOOM_RANGE = [10, 16];

function init() {
    map.init(CENTER, ZOOM, ZOOM_RANGE);
    c3.generate({
        bindto: '#chart',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ]
        }
    });
}

window.onload = init;
actions.init();
