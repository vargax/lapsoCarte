import MainController from './LapsocarteAppController.js'

let mainController;

export default class DataController {
    constructor() {
        mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_setGeoJSON(geoJSON) {

    }
}