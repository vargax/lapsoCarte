import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'
import $ from 'jquery'
// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const GEOM_MAP = glbs.DATA_CONSTANTS.WHERE_MAP;
const DATA_MAP = glbs.DATA_CONSTANTS.DATA_MAP;
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
        console.dir(glbs.PROJECT[GEOM_MAP]);

        this._amIready();
    }

    mc_registerData(json) {
        /*
         4 dimensions map:
            |-> First  key -> GROUP
            |-> Second key -> WHAT  -> data set
            |-> Third  key -> WHEN  -> t
            |-> Fourth key -> WHERE -> gid.
            |-> Element    -> The actual data...
          */
        dataMap = new Map();
        timeVector = [];

        for (let row of json) {
            let group = row[glbs.PROJECT.COLUMN_GROUP];
            let what  = row[glbs.PROJECT.COLUMN_WHAT];
            let when  = row[glbs.PROJECT.COLUMN_WHEN];
            let where = row[glbs.PROJECT.COLUMN_WHERE];
            let data  = row[glbs.PROJECT.COLUMN_DATA];

            let stack = [data, where, when, what, group];

            recursiveInsert(dataMap, stack);

            function recursiveInsert(map, stack) {
                let key = stack.pop();

                if (stack.length == 1) {
                    let data = stack.pop();
                    map.set(key, data);
                    return;
                }

                let nextMap = map.get(key);

                if (nextMap == undefined) {
                    nextMap = new Map();
                    map.set(key, nextMap);
                }
                recursiveInsert(nextMap, stack);
            }
        }
        console.dir(dataMap);

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