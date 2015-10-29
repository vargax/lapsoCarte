import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let geometriesMap;
let dataMap;
let timeVector;

export default class DataController {
    constructor() {
        _mainController = new MainController();

        geometriesMap = new Map();
        // Map of maps: First key time, submaps key gid.
        dataMap = new Map();
        timeVector = [];
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_registerGeometries(geoJSON) {
        for (let feature of geoJSON['features']) {
            let geometry = feature['geometry'];
            let gid = feature['properties'][glbs.PROJECT.COLUMN_GID];

            geometriesMap.set(gid,geometry);
        }
        console.log('dataController.mc_registerGeometries() :: '+geometriesMap.size+' geometries registered!');
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
        console.log('dataController.mc_registerData() :: '+timeVector.length+' time periods registered!');
    }
}