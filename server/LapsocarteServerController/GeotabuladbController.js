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
const COLUMN_GROUP = glbs.PROJECT.COLUMN_GROUP;
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
    }

    mc_getGeometries() {
        let log = '.mc_getGeometries()';
        let parameters = {
            tableName: TABLE_GEOM,
            geometry: COLUMN_GEOM
        };
        _geo.geoQuery(parameters, _mainController.sc_giveGeometries);
    }

    mc_getData() {
        let log = '.mc_getData('+TIME_RANGE+')';

        let query = 'SELECT * FROM '+TABLE_DATA+' WHERE ';
        for (let t of TIME_RANGE) {
            query += COLUMN_WHEN+'='+t+' OR ';
        }
        query = query.slice(0,-4);
        query += ';';
        _geo.query(query, _mainController.sc_giveData);
    }
}
