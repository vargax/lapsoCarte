import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'
require('descriptive-statistics');

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let _data;
let _descriptiveStats;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
export default class DataController{
    constructor() {
        _mainController = new MainController();
    }

    mc_setData(JSON) {
        _data = [];

        for (let item of JSON)
            _data.push(item[glbs.PROJECT.COLUMN_DATA]);

        _descriptiveStats = {

        };
        console.dir(_descriptiveStats);
    }

    mc_getDescriptiveStats() {
        return _descriptiveStats;
    }
}