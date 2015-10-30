import MainController from './../GUIController.js'
import PlayerControl from './SliderController.js'

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

    mc_setTimeVector(tVector) {
        timeVector = tVector;
        _playerControl = new PlayerControl(timeVector);
    }

    slc_movedTo(newTime) {
        _mainController.sc_setTime(newTime);
    }
}