import * as glbs from 'modules/globals.js';
import * as map from 'modules/map.js';
import * as actions from 'modules/actions.js';

const CENTER = [4.66198, -74.09866];
const ZOOM = 11;
const ZOOM_RANGE = [10, 16];

function init() {
    map.init(CENTER, ZOOM, ZOOM_RANGE);
}

window.onload = init;
actions.init();