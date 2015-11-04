import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let geometriesMap = null;
let dataMap = null;
let descriptiveStats = null;

let timeVector;

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
        console.log('dataController.mc_registerData() :: '+timeVector.length+' time periods registered!');
        console.dir(timeVector);

        this._amIready();
    }

    mc_registerDescriptiveStats(object) {
        descriptiveStats = object;
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