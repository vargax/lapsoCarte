import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'
import JStat from 'jStat'

import util from 'util'
// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const HOWs_VECTOR = glbs.DATA_CONSTANTS.HOWs_VECTOR;
const WHATs_VECTOR = glbs.DATA_CONSTANTS.WHATs_VECTOR;
const WHENs_VECTOR = glbs.DATA_CONSTANTS.WHENs_VECTOR;
const WHEREs_MAP =   glbs.DATA_CONSTANTS.WHEREs_MAP;

const DATA_MAP = glbs.DATA_CONSTANTS.DATA_MAP;
const DESC_STATS = glbs.DATA_CONSTANTS.DESCRIPTIVE_STATS;

const HOWs_READY       = 'HOWs_READY';
const WHATs_READY      = 'WHATs_READY';
const WHENs_READY      = 'WHENs_READY';
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
export default class DataController{
    constructor() {
        _mainController = new MainController();
        done = new Map();
        done.set(DESC_STATS_READY, false).set(DATA_READY, false);
        done.set(HOWs_READY, false).set(WHATs_READY, false).set(WHENs_READY, false).set(WHEREs_READY, false);
    }

    mc_setHows(json) {
        let key = glbs.PROJECT.COLUMN_HOW;
        let array = this.__json2array(key,json);
        glbs.PROJECT[HOWs_VECTOR] = array;

        console.log('_dataController.mc_setHows() :: '+array.length+' HOWs ('+key+') registered!');
        done.set(HOWs_READY, true);
        this._amIready();
    }

    mc_setWhats(json) {
        let key = glbs.PROJECT.COLUMN_WHAT;
        let array = this.__json2array(key,json);
        glbs.PROJECT[WHATs_VECTOR] = array;

        console.log('_dataController.mc_setWhats() :: '+array.length+' WHATs ('+key+') registered!');
        done.set(WHATs_READY, true);
        this._amIready();
    }

    mc_setWhens(json) {
        let key = glbs.PROJECT.COLUMN_WHEN;
        let array = this.__json2array(key,json);
        glbs.PROJECT[WHENs_VECTOR] = array;

        console.log('_dataController.mc_setWhens() :: '+array.length+' WHENs ('+key+') registered!');
        done.set(WHENs_READY, true);
        this._amIready();
    }

    mc_setWheres(geoJSON) {
        let geometriesMap = new Map();

        let key = glbs.PROJECT.COLUMN_WHERE;
        for (let feature of geoJSON['features']) {
            let gid = feature['properties'][key];
            geometriesMap.set(gid,feature);
        }

        glbs.PROJECT[WHEREs_MAP] = geometriesMap;

        console.log('_dataController.mc_setWheres() :: '+geometriesMap.size+' WHEREs ('+key+') registered!');
        done.set(WHEREs_READY, true);
        this._amIready();
    }

    mc_setData(json) {
        /*
         4 dimensions map:
         |-> First  key -> HOW
         |-> Second key -> WHAT  -> data set
         |-> Third  key -> WHEN  -> t
         |-> Fourth key -> WHERE -> gid.
         |-> Element    -> The actual data...
         */
        let dataMap = new Map(), counter = 0;

        for (let row of json) {
            let how = row[glbs.PROJECT.COLUMN_HOW];
            let what  = row[glbs.PROJECT.COLUMN_WHAT];
            let when  = row[glbs.PROJECT.COLUMN_WHEN];
            let where = row[glbs.PROJECT.COLUMN_WHERE];
            let data  = row[glbs.PROJECT.COLUMN_DATA];

            let stack = [data, where, when, what, how];

            recursiveInsert(dataMap, stack);
        }

        glbs.PROJECT[DATA_MAP] = dataMap;

        console.log('_dataController.mc_setData() :: '+counter+' DATA ('+glbs.PROJECT.COLUMN_DATA+') elements registered!');
        done.set(DATA_READY, true);
        this._amIready();

        this._genDescriptiveStats();

        function recursiveInsert(map, stack) {
            let key = stack.pop();

            if (stack.length == 1) {
                let data = stack.pop();
                map.set(key, data);
                counter++;
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

    _genDescriptiveStats() {
        const   DS_MIN            = glbs.DATA_CONSTANTS.DS_MIN,
                DS_MAX            = glbs.DATA_CONSTANTS.DS_MAX,
                DS_MEAN           = glbs.DATA_CONSTANTS.DS_MEAN,
                DS_KEYS_VECTOR   = glbs.DATA_CONSTANTS.DS_KEYS_VECTOR,
                DS_DATA_VECTOR    = glbs.DATA_CONSTANTS.DS_DATA_VECTOR;

        let dataMap = glbs.PROJECT[DATA_MAP];
        //  |-> How -> What -> When -> Where -> Data

        let counter = 0, descriptiveStats = recursiveStats(dataMap);
        glbs.PROJECT[DESC_STATS] = descriptiveStats;

        console.log('_dataController._genDescriptiveStats() :: Descriptive statistics done for '+counter+' elements!');
        done.set(DESC_STATS_READY, true);
        this._amIready();

        function recursiveStats(map) {
            let stats = new Map(), dataArray = [], keysArray = [];

            for (let [key, candidate] of map) {

                if(typeof candidate == 'object') {
                    let childStats = recursiveStats(candidate);
                    dataArray = dataArray.concat(childStats.get(DS_DATA_VECTOR));
                    stats.set(key, childStats);
                } else {
                    dataArray.push(candidate);
                }
                keysArray.push(key);
            }

            stats.set(DS_DATA_VECTOR, dataArray);
            stats.set(DS_KEYS_VECTOR, new Array.from(new Set(keysArray))); // --> Removing duplicates

            stats.set(DS_MIN, JStat.jStat.min(dataArray));
            stats.set(DS_MAX, JStat.jStat.max(dataArray));
            stats.set(DS_MEAN, JStat.jStat.mean(dataArray));

            counter++;
            return stats;
        }
    }

    _amIready() {
        for (let method of done.values())
            if (!method) return;

        _mainController.sc_ready(this);
    }

    __json2array(key, json) {
        let array = [];

        for(let row of json)
            array.push(row[key]);

        return array;
    }
}