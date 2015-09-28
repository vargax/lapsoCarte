import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let geoTimeJSONsMap;
let timeVector;

export default class DataController {
    constructor() {
        _mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_geoTimeJSONsRegister (geoTimeJSONsArray) {
        geoTimeJSONsMap = new Map();
        timeVector = [];

        for (let geoTimeJSON of geoTimeJSONsArray) {
            let [t, geoJSON] = glbs.GeoTimeJSON.unpack(geoTimeJSON);
            timeVector.push(t);
            geoTimeJSONsMap.set(t, geoJSON);
        }
        timeVector.sort();
    }

    mc_getGeoTimeJSONsMap() {
        return geoTimeJSONsMap;
    }

    mc_getTimeVector() {
        return timeVector;
    }
}