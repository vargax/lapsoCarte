import * as glbs from './../../../../Globals.js'

import MainController from './../GUIController.js'
import SliderController from './SliderController.js'

let _mainController;
let _playerControl;

let timeVector;

let timeController = null; // --> Singleton Pattern...
export default class TimeController {
    constructor() {
        if (!timeController) {
            timeController = this;
            _mainController = new MainController();
        }
        return timeController;
    }

    mc_loadTimeVector() {
        _playerControl = new SliderController();
        _mainController.sc_ready(this);
    }

    slc_movedTo(newTime) {
        glbs.PROJECT[glbs.DATA_CONSTANTS.CURRENT_TIME] = newTime;
        _mainController.sc_timeChange();
    }
}