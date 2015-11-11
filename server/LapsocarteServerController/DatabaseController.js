import * as crypto from 'crypto'
import GeotabulaDB from 'geotabuladb'

import * as glbs from '../../Globals.js'
import MainController from './LapsocarteServerController.js'

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const DB_USER = glbs.PROJECT.DB_USER;
const DB_PASS = glbs.PROJECT.DB_PASS;
const DB_NAME = glbs.PROJECT.DB_NAME;

const TABLE_DATA = glbs.PROJECT.TABLE_DATA;
const COLUMN_HOW = glbs.PROJECT.COLUMN_HOW;
const COLUMN_WHAT  = glbs.PROJECT.COLUMN_WHAT;
const COLUMN_WHERE = glbs.PROJECT.COLUMN_WHERE;
const COLUMN_WHEN  = glbs.PROJECT.COLUMN_WHEN;
const COLUMN_DATA  = glbs.PROJECT.COLUMN_DATA;

const TABLE_GEOM = glbs.PROJECT.TABLE_GEOM;
const COLUMN_GEOM = glbs.PROJECT.COLUMN_GEOM;

const TIME_RANGE = glbs.PROJECT.TIME_RANGE;

const logString = 'GeotabuladbController';
const logOK  = ' :: ';
const logERR = ' !! ';

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;
let _geo;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let _queries;
let _results;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class GeotabuladbController {
    constructor() {
        _mainController = new MainController();
        _geo = new GeotabulaDB();
        _queries = new Map();
        _results = new Map();
    }

    mc_init() {
        _geo.setCredentials({
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        });

        this._getWheres();

        let queries = [];
        let sqlTimeWhere = this.__genFilteredTimeWhere();

        let howQuery = {
            query: 'SELECT DISTINCT '+COLUMN_HOW+' FROM '+TABLE_DATA + sqlTimeWhere,
            callback: _mainController.sc_giveHows
        };
        queries.push(howQuery);

        let whatsQuery = {
            query: 'SELECT DISTINCT '+COLUMN_WHAT+' FROM '+TABLE_DATA + sqlTimeWhere,
            callback: _mainController.sc_giveWhats
        };
        queries.push(whatsQuery);

        let whensQuery = {
            query: 'SELECT DISTINCT '+COLUMN_WHEN+' FROM '+TABLE_DATA + sqlTimeWhere,
            callback: _mainController.sc_giveWhens
        };
        queries.push(whensQuery);

        let dataQuery = {
            query: 'SELECT * FROM '+TABLE_DATA + sqlTimeWhere,
            callback: _mainController.sc_giveData
        };
        queries.push(dataQuery);

        let hashMap = new Map();
        recursiveQuery();

        function recursiveQuery(result, hash) {
            try {
                let callback = hashMap.get(hash);
                callback(result);
            } catch (e) {
                if (e instanceof TypeError)
                    console.log('! First recursiveQuery() call...');
                else console.dir(e);
            }

            let nextQuery = queries.pop();
            if (nextQuery != undefined) {
                let nextHash = _geo.query(nextQuery.query, recursiveQuery);
                hashMap.set(nextHash, nextQuery.callback)
            }
        }
    }

    _getWheres() {
        // ToDo improve this method to only retrieve the geometries who have related data
        let parameters = {
            tableName: TABLE_GEOM,
            geometry: COLUMN_GEOM
        };
        _geo.geoQuery(parameters, _mainController.sc_giveWheres);
    }

    __genFilteredTimeWhere() {
        let where = ' WHERE ';
        for (let t of TIME_RANGE) {
            where += COLUMN_WHEN+'='+t+' OR ';
        }
        where = where.slice(0,-4);
        where += ';';

        return where;
    }
}
