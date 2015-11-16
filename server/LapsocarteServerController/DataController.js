import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'
import JStat from 'jStat'

import util from 'util'
// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const WHEREs_MAP =   glbs.DATA_KEYs.WHEREs_MAP;
const DATA_MAP = glbs.DATA_KEYs.DATA_MAP;
const DESC_STATS = glbs.DATA_KEYs.DESCRIPTIVE_STATS;

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
        done.set(DESC_STATS_READY, false).set(DATA_READY, false).set(WHEREs_READY, false);
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
        const   DS_MIN            = glbs.DATA_KEYs.DS_MIN,
                DS_MAX            = glbs.DATA_KEYs.DS_MAX,
                DS_MEAN           = glbs.DATA_KEYs.DS_MEAN,
                DS_KEYS_VECTOR   = glbs.DATA_KEYs.DS_KEYS_VECTOR,
                DS_DATA_VECTOR    = glbs.DATA_KEYs.DS_DATA_VECTOR;

        let dataMap = glbs.PROJECT[DATA_MAP];
        //  |-> How -> What -> When -> Where -> Data

        let counter = 0;
        glbs.PROJECT[DESC_STATS] = recursiveStats(dataMap);

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
}