// ---------------------------------------------------------------------------------------------------------------------
// Project CONSTANTS
// ---------------------------------------------------------------------------------------------------------------------

// DEMO ----------------------------------------------------------------------------------------------------------------
let demo = {
    PROJECT: 'lapsocarte',

    /* server/LapsocarteServerController/GeotabuladbController.js */
    TABLE: 'population',
    COLUMN_GEOM: 'geom',
    COLUMN_TIME: 't',
    COLUMN_NAME: 'nomb_barr',
    COLUMN_DATA: 'population',

    /* app/LapsocarteAppController/GUIController/GUIController.js */
    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    /* app/LapsocarteAppController/GUIController/LeafletController.js */
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    /* app/LapsocarteAppController/GUIController/Support.js */
    FOCUSED_COLOR: '#0000FF',
    FUNC_DATA2COLOR: function (d) {
        // To get the color of each COLUMN_GEOM in function of COLUMN_DATA
        return  d > 8000 ? '#800026' :
                d > 7000 ? '#BD0026' :
                d > 6000 ? '#E31A1C' :
                d > 5000 ? '#FC4E2A' :
                d > 4000 ? '#FD8D3C' :
                d > 3000 ? '#FEB24C' :
                d > 2000 ? '#FED976' : '#FFEDA0';
    }
};
demo.DB_USER = demo.PROJECT;
demo.DB_PASS = demo.PROJECT;
demo.DB_NAME = demo.PROJECT;

// Project TOMSA -------------------------------------------------------------------------------------------------------
let tomsa = {
    PROJECT: 'tomsa',

    TABLE: 'schelling',
    COLUMN_GEOM: 'geom',
    COLUMN_TIME: 't',
    COLUMN_NAME: 'gid',
    COLUMN_DATA: 'currentpop',

    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    FOCUSED_COLOR: 'green',
    FUNC_DATA2COLOR: function (d) {
        return  d == 0 ? 'gray'  :
                d == 1 ? 'red'   :
                d == 2 ? 'blue'  :
                d == 3 ? 'yellow': 'black';
    }
};
tomsa.DB_USER = tomsa.PROJECT;
tomsa.DB_PASS = tomsa.PROJECT;
tomsa.DB_NAME = tomsa.PROJECT;

export const PROJECT = tomsa;

// ---------------------------------------------------------------------------------------------------------------------
// Server-Client socket CONSTANTS (sck)
// ---------------------------------------------------------------------------------------------------------------------


export const ADD_LAYER = 'add_layer';
export const GET_LAYERS = 'get_layers';

export class GeoTimeJSON {
    static pack (t, geoJSON) {
        geoJSON['time'] = t;
        return geoJSON;
    }

    static unpack(geoTimeJSON) {
        let t = geoTimeJSON['time'];
        delete geoTimeJSON['time'];
        return [t, geoTimeJSON];
    }
}