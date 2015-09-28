import MainController from './../BootleafController.js'
import PlayerControl from './SliderController.js'

let _mainController;
let _playerControl;

let _timeVector;

let leafletplaybackController = null; // --> Singleton Pattern...
export default class LeafletplaybackController {
    constructor() {
        if (!leafletplaybackController) {
            leafletplaybackController = this;

            _mainController = new MainController();

        }
        return leafletplaybackController;
    }

    mc_setTimeVector(timeVector) {
        _timeVector = timeVector;
        _playerControl = new PlayerControl(_timeVector);
    }
    slc_movedTo(newTime) {
        _mainController.sc_setTime(newTime);
    }
}