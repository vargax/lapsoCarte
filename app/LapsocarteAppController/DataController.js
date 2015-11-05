import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const GEOM_MAP = glbs.DATA_CONSTANTS.GEOMETRIES_MAP;
const DATA_MAP = glbs.DATA_CONSTANTS.DATA_MAP;
const TIME_VECT = glbs.DATA_CONSTANTS.TIME_VECTOR;
const DESC_STATS = glbs.DATA_CONSTANTS.DESCRIPTIVE_STATS;

const CURRENT_TIME = glbs.DATA_CONSTANTS.CURRENT_TIME;
// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let geometriesMap  = null;
let dataMap = null;
let timeVector =  null;
let descriptiveStats = null;

let _mainController;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class DataController {
    constructor() {
        _mainController = new MainController();
        timeVector = [];
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_registerGeometries(geoJSON) {
        geometriesMap = new Map();

        for (let feature of geoJSON['features']) {
            let gid = feature['properties'][glbs.PROJECT.COLUMN_GID];

            geometriesMap.set(gid,feature);
        }

        glbs.PROJECT[GEOM_MAP] = geometriesMap;
        console.log('dataController.mc_registerGeometries() :: '+geometriesMap.size+' geometries registered!');

        this._amIready();
    }

    mc_registerData(json) {
        // Map of maps: First key -> time, submaps key -> gid.
        dataMap = new Map();

        for (let data of json) {
            let time = data[glbs.PROJECT.COLUMN_TIME];
            let gid = data[glbs.PROJECT.COLUMN_GID];

            try {
                dataMap.get(time).set(gid,data);
            } catch (e) {
                let gidMap = new Map();
                gidMap.set(gid,data);
                dataMap.set(time,gidMap);
            }
        }

        for (let t of dataMap.keys()) timeVector.push(t);

        timeVector.sort(function(a, b){return a-b});

        glbs.PROJECT[DATA_MAP] = dataMap;
        glbs.PROJECT[TIME_VECT] = timeVector;
        glbs.PROJECT[CURRENT_TIME] = timeVector[0];

        console.log('dataController.mc_registerData() :: '+timeVector.length+' time periods registered!');
        console.dir(timeVector);

        this._amIready();
    }

    mc_registerDescriptiveStats(object) {
        descriptiveStats = object;

        glbs.PROJECT[DESC_STATS] = descriptiveStats;
        console.log('dataController.mc_registerDescriptiveStats() :: Data descriptive statistics registered!');
        console.dir(descriptiveStats);

        this._amIready();
    }

    mc_getGeometries() {
        return geometriesMap;
    }

    mc_getData() {
        return dataMap;
    }

    mc_getTimeVector() {
        return timeVector;
    }

    mc_getDescriptiveStats() {
        return descriptiveStats;
    }

    _amIready() {
        if (geometriesMap && dataMap && descriptiveStats) {
            _mainController.sc_ready(this);
            return true;
        }
        return false;
    }
}