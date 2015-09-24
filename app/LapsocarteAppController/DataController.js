import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let geoTimeJSONsMap;
let timeRange;

export default class DataController {
    constructor() {
        _mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_geoTimeJSONsRegister (geoTimeJSONsArray) {
        geoTimeJSONsMap = new Map();
        timeRange = [];

        for (let geoTimeJSON of geoTimeJSONsArray) {
            let [t, geoJSON] = glbs.GeoTimeJSON.unpack(geoTimeJSON);
            timeRange.push(t);
            geoTimeJSONsMap.set(t, geoJSON);
        }
        timeRange.sort();
    }

    mc_getGeoTimeJSONsMap() {
        return geoTimeJSONsMap;
    }

    mc_getTimeRange() {
        return timeRange;
    }
}