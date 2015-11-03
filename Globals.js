// ---------------------------------------------------------------------------------------------------------------------
// Project CONSTANTS
// ---------------------------------------------------------------------------------------------------------------------

// DEMO ----------------------------------------------------------------------------------------------------------------
let demo = {
    PROJECT: 'lapsocarte',

    /* server/LapsocarteServerController/GeotabuladbController.js */
    COLUMN_GID: 'gid',
    TABLE_GEOM: 'barrios_catastrales_wgs84',
    COLUMN_GEOM: 'geom',
    TABLE_DATA: 'population',
    COLUMN_NAME: 'nomb_barr',
    COLUMN_DATA: 'population',
    COLUMN_TIME: 't',
    TIME_RANGE: [1,2,3,4,5,6,7,8,9,10],

    /* app/LapsocarteAppController/GUIController/LeafletController.js */
    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    /* app/LapsocarteAppController/GUIController/LeafletController.js */
    DEFAULT_STYLE: {color: 'blue', weight: 1.2},
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

    COLUMN_GID: 'gid',
    TABLE_GEOM: 'manzanas',
    COLUMN_GEOM: 'geom',
    TABLE_DATA: 'schelling',
    COLUMN_NAME: 'gid',
    COLUMN_DATA: 'currentpop',
    COLUMN_TIME: 't',
    TIME_RANGE: [0,3,6,9,12,15,18,21,24,27,30],
    //TIME_RANGE: [0],

    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    DEFAULT_STYLE: {color: 'blue', weight: 1.2},
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

// Project MARS --------------------------------------------------------------------------------------------------------
let mars = {
    PROJECT: 'mars',

    COLUMN_GID: 'mars',
    TABLE_GEOM: 'mars_bogota',
    COLUMN_GEOM: 'geom',
    TABLE_DATA: 'cars',
    COLUMN_NAME: 'mars',
    COLUMN_TIME: 't',
    TIME_RANGE: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    //TIME_RANGE: [0],

    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    DEFAULT_STYLE: {color: 'blue', weight: 1.2},
    FOCUSED_COLOR: 'green',
    FUNC_DATA2COLOR: function (d) {
        return  d > 1150 ? '#800026' :
                d > 1000 ? '#BD0026' :
                d > 850 ? '#E31A1C' :
                d > 700 ? '#FC4E2A' :
                d > 550 ? '#FD8D3C' :
                d > 400 ? '#FEB24C' :
                d > 250 ? '#FED976' : '#FFEDA0';
    }
};
mars.DB_USER = mars.PROJECT;
mars.DB_PASS = mars.PROJECT;
mars.DB_NAME = mars.PROJECT;

mars.COLUMN_DATA = mars.TABLE_DATA;

export const PROJECT = mars;

// ---------------------------------------------------------------------------------------------------------------------
// Generic FUNC_DATA2COLOR functions
// ---------------------------------------------------------------------------------------------------------------------
function choropleth(d) {

}

// ---------------------------------------------------------------------------------------------------------------------
// Server-Client socket CONSTANTS (sck)
// ---------------------------------------------------------------------------------------------------------------------
export const INIT = 'init';
export const GIVE_DATA = 'give_data';
export const GIVE_GEOM = 'give_geom';
export const GIVE_STATS = 'give_stats';