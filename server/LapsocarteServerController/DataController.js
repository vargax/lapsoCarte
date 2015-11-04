import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'
import JStat from 'jStat'

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
            MAX: JStat.jStat.max(_data),
            MIN: JStat.jStat.min(_data)
        };
        console.dir(_descriptiveStats);
    }

    mc_getDescriptiveStats() {
        return _descriptiveStats;
    }
}