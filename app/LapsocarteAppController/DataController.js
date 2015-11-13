import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'
import $ from 'jquery'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const HOWs_VECTOR = glbs.DATA_CONSTANTS.HOWs_VECTOR;
const WHATs_VECTOR = glbs.DATA_CONSTANTS.WHATs_VECTOR;
const WHENs_VECTOR = glbs.DATA_CONSTANTS.WHENs_VECTOR;
const WHEREs_MAP =   glbs.DATA_CONSTANTS.WHEREs_MAP;

const DATA_MAP = glbs.DATA_CONSTANTS.DATA_MAP;
const DESC_STATS = glbs.DATA_CONSTANTS.DESCRIPTIVE_STATS;

const WHEREs_READY     = 'WHEREs_READY';
const DATA_READY       = 'DATA_READY';
const DESC_STATS_READY = 'DESC_STATS_READY';
// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let done;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class DataController {
    constructor() {
        _mainController = new MainController();
        done = new Map();
        done.set(DESC_STATS_READY, false).set(DATA_READY, false).set(WHEREs_READY, false);
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_registerGeometries(JSON) {

        glbs.PROJECT[WHEREs_MAP] = new Map(JSON);
        console.log('dataController.mc_registerGeometries() :: '+glbs.PROJECT[WHEREs_MAP].size+' geometries registered!');
        console.dir(glbs.PROJECT[WHEREs_MAP]);

        done.set(DATA_READY, true);
        this._amIready();
    }

    mc_registerData(object) {

        glbs.PROJECT[HOWs_VECTOR]   = object[HOWs_VECTOR];
        console.log('dataController.mc_registerData() :: '+glbs.PROJECT[HOWs_VECTOR].length+' HOWs registered!');
        console.dir(glbs.PROJECT[HOWs_VECTOR]);

        glbs.PROJECT[WHATs_VECTOR]  = object[WHATs_VECTOR];
        console.log('dataController.mc_registerData() :: '+glbs.PROJECT[WHATs_VECTOR].length+' WHATs registered!');
        console.dir(glbs.PROJECT[WHATs_VECTOR]);

        glbs.PROJECT[WHENs_VECTOR]  = object[WHENs_VECTOR];
        console.log('dataController.mc_registerData() :: '+glbs.PROJECT[WHENs_VECTOR].length+' WHENs registered!');
        console.dir(glbs.PROJECT[WHENs_VECTOR]);

        glbs.PROJECT[DATA_MAP]      = new Map(object[DATA_MAP]);
        console.log('dataController.mc_registerData() :: DATA registered!');
        console.dir(glbs.PROJECT[DATA_MAP]);

        done.set(WHEREs_READY, true);
        this._amIready();
    }

    mc_registerDescriptiveStats(json) {

        glbs.PROJECT[DESC_STATS] = this._JSON2Map(json);
        console.log('dataController.mc_registerDescriptiveStats() :: Data descriptive statistics registered!');
        console.dir(glbs.PROJECT[DESC_STATS]);

        done.set(DESC_STATS_READY, true);
        this._amIready();
    }

    _JSON2Map(json) {
        return new Map(JSON.parse(json));
    }

    _amIready() {
        for (let method of done.values())
            if (!method) return;

        _mainController.sc_ready(this);
    }
}