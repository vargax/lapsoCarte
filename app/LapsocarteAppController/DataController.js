import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let geometriesMap;
let dataMap;
let timeVector;

let descriptiveStats;

export default class DataController {
    constructor() {
        _mainController = new MainController();

        geometriesMap = new Map();
        // Map of maps: First key -> time, submaps key -> gid.
        dataMap = new Map();
        timeVector = [];
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_registerGeometries(geoJSON) {
        for (let feature of geoJSON['features']) {
            let gid = feature['properties'][glbs.PROJECT.COLUMN_GID];

            geometriesMap.set(gid,feature);
        }
        console.log('dataController.mc_registerGeometries() :: '+geometriesMap.size+' geometries registered!');
        console.dir(geometriesMap)
    }

    mc_registerData(json) {
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
        console.log('dataController.mc_registerData() :: '+timeVector+' time periods registered!');
        console.dir(dataMap)
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
}