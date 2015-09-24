import MainController from './LapsocarteAppController.js'
import * as glbs from '../../Globals.js'

let _mainController;

let _geoTimeJSONsMap;
let _timeRange;

export default class DataController {
    constructor() {
        _mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_geoTimeJSONsRegister (geoTimeJSONsArray) {
        _geoTimeJSONsMap = new Map();

        for (let geoTimeJSON of geoTimeJSONsArray) {
            let unpack = glbs.GeoTimeJSON.unpack(geoTimeJSON);
            _geoTimeJSONsMap.set(unpack[0], unpack[1]);
        }


    }

    mc_getGeoTimeJSONsMap() {
        return _geoTimeJSONsMap;
    }
}