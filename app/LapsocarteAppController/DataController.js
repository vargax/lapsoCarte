import MainController from './LapsocarteAppController.js'

let _mainController;

export default class DataController {
    constructor() {
        _mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_setGeoJSON(geoJSON) {

    }
}