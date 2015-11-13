import * as glbs from './../../../../Globals.js'

import MainController from './../GUIController.js'
import SliderController from './SliderController.js'

const CURRENT_WHEN  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.CURRENT_WHEN;

let _mainController;
let _sliderController = null;

let instance;

let timeController = null; // --> Singleton Pattern...
export default class TimeController {
    constructor() {
        if (!timeController) {
            timeController = this;
            _mainController = new MainController();

            const INSTANCE_KEY = glbs.DATA_CONSTANTS.LPC_INSTANCE_KEY;
            instance = glbs.PROJECT[INSTANCE_KEY];
        }
        return timeController;
    }

    mc_loadTimeVector() {
        if (!_sliderController) {
            _sliderController = new SliderController();
            _mainController.sc_ready(this);
        }
        _sliderController.mc_update();
    }

    slc_movedTo(newTime) {
        instance[CURRENT_WHEN] = newTime;
        _mainController.sc_timeChange();
    }
}