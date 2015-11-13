import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'
import $ from 'jquery'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
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
    mc_registerGeometries(json) {
        glbs.PROJECT[WHEREs_MAP] = this._recursiveMap(JSON.parse(json));
        console.log('dataController.mc_registerGeometries() :: '+glbs.PROJECT[WHEREs_MAP].size+' geometries registered!');
        console.dir(glbs.PROJECT[WHEREs_MAP]);

        done.set(DATA_READY, true);
        this._amIready();
    }

    mc_registerData(json) {
        glbs.PROJECT[DATA_MAP] = this._recursiveMap(JSON.parse(json));
        console.log('dataController.mc_registerData() :: DATA registered!');
        console.dir(glbs.PROJECT[DATA_MAP]);

        done.set(WHEREs_READY, true);
        this._amIready();
    }

    mc_registerDescriptiveStats(json) {
        glbs.PROJECT[DESC_STATS] = this._recursiveMap(JSON.parse(json));
        console.log('dataController.mc_registerDescriptiveStats() :: Data descriptive statistics registered!');
        console.dir(glbs.PROJECT[DESC_STATS]);

        done.set(DESC_STATS_READY, true);
        this._amIready();
    }

    _recursiveMap(array) {
        let map = new Map(array);

        for (let [key, candidate] of map) {
            if (Array.isArray(candidate) && candidate[0].length == 2)
                map.set(key, this._recursiveMap(candidate));
        }

        return map;
    }

    _amIready() {
        for (let method of done.values())
            if (!method) return;

        _mainController.sc_ready(this);
    }
}