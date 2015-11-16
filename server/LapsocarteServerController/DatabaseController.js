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
const COLUMN_WHEN  = glbs.PROJECT.COLUMN_WHEN;

const TABLE_GEOM = glbs.PROJECT.TABLE_GEOM;
const COLUMN_GEOM = glbs.PROJECT.COLUMN_GEOM;

const TIME_RANGE = glbs.PROJECT.TIME_RANGE;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;
let _geo;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class DatabaseController {
    constructor() {
        _mainController = new MainController();
        _geo = new GeotabulaDB();
    }

    mc_init() {
        _geo.setCredentials({
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        });

        this._getWheres();
        this._getData();

        _mainController.sc_ready(this);
    }

    _getData() {
        let query = 'SELECT * FROM '+TABLE_DATA + this.__genFilteredTimeWhere() + ';';
        _geo.query(query, _mainController.sc_giveData);
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

        return where;
    }
}
