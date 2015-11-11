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

const CURRENT_TIME = glbs.DATA_CONSTANTS.CURRENT_TIME;

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
        done = {
            hows: false,
            whats: false,
            whens: false,
            wheres: false,
            data: false
        }
    }

    mc_setHows(json) {
        let key = glbs.PROJECT.COLUMN_HOW;
        let array = this.__json2array(key,json);
        glbs.PROJECT[glbs.DATA_CONSTANTS.HOWs_VECTOR] = array;

        console.log('_dataController.mc_setHows() :: '+array.length+' HOWs ('+key+') registered!');
        done.hows = true;
        this._genDescriptiveStats();
    }

    mc_setWhats(json) {
        let key = glbs.PROJECT.COLUMN_WHAT;
        let array = this.__json2array(key,json);
        glbs.PROJECT[glbs.DATA_CONSTANTS.WHATs_VECTOR] = array;

        console.log('_dataController.mc_setWhats() :: '+array.length+' WHATs ('+key+') registered!');
        done.whats = true;
        this._genDescriptiveStats();
    }

    mc_setWhens(json) {
        let key = glbs.PROJECT.COLUMN_WHEN;
        let array = this.__json2array(key,json);
        glbs.PROJECT[glbs.DATA_CONSTANTS.WHENs_VECTOR] = array;

        console.log('_dataController.mc_setWhens() :: '+array.length+' WHENs ('+key+') registered!');
        done.whens = true;
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
        done.wheres = true;
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

        glbs.PROJECT[DATA_MAP] = dataMap;

        console.log('_dataController.mc_setData() :: '+counter+' DATA ('+glbs.PROJECT.COLUMN_DATA+') elements registered!');
        done.data = true;
        this._genDescriptiveStats();
    }

    _genDescriptiveStats() {
        if (!done.data || !done.whats || !done.hows) return;

        const   DS_MIN            = glbs.DATA_CONSTANTS.DS_MIN,
                DS_MAX            = glbs.DATA_CONSTANTS.DS_MAX,
                DS_MEAN           = glbs.DATA_CONSTANTS.DS_MEAN,
                DS_KEYS_VECTOR   = glbs.DATA_CONSTANTS.DS_KEYS_VECTOR,
                DS_DATA_VECTOR    = glbs.DATA_CONSTANTS.DS_DATA_VECTOR;

        let dataMap = glbs.PROJECT[DATA_MAP];
        //  |-> How -> What -> When -> Where -> Data

        let descriptiveStats = recursiveStats(dataMap);
        glbs.PROJECT[DESC_STATS] = descriptiveStats;

        function recursiveStats(map) {
            let stats = {}, dataArray = [], keysArray = [];

            for (let [key, candidate] of map) {

                if(typeof candidate == 'object') {
                    let childStats = recursiveStats(candidate);
                    dataArray = dataArray.concat(childStats[DS_DATA_VECTOR]);
                    stats[key] = childStats;
                } else {
                    dataArray.push(candidate);
                }
                keysArray.push(key);
            }

            stats[DS_DATA_VECTOR] = dataArray;

            let keysSet = new Set(keysArray);
            stats[DS_KEYS_VECTOR] = new Array.from(keysSet);

            stats[DS_MIN] = JStat.jStat.min(dataArray);
            stats[DS_MAX] = JStat.jStat.max(dataArray);
            stats[DS_MEAN] = JStat.jStat.mean(dataArray);

            return stats;
        }
    }

    __json2array(key, json) {
        let array = [];

        for(let row of json)
            array.push(row[key]);

        return array;
    }
}