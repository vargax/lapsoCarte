import MainController from './../BootleafController.js'
import PlayerControl from './PlayerControl.js'

let _mainController;
let _playerControl;
let map;

let _timeVector;
let _isPlaying;

let leafletplaybackController = null; // --> Singleton Pattern...
export default class LeafletplaybackController {
    constructor() {
        if (!leafletplaybackController) {
            leafletplaybackController = this;

            _mainController = new MainController();
            map = _mainController.sc_getMap();

            _isPlaying = false;
        }
        return leafletplaybackController;
    }

    mc_setTimeVector(timeVector) {
        _timeVector = timeVector;

        try {
            map.removeControl(_playerControl.mc_getLeafletControll());
        } catch(e) {
            console.log("+! This is the first playerControl!");
        }

        _playerControl = new PlayerControl(_timeVector);
        map.addControl(_playerControl.mc_getLeafletControll());
    }

    pc_isPlaying() {
        return _isPlaying;
    }

    pc_movedTo(newTime) {
        _mainController.sc_setTime(newTime);
    }

    pc_play() {
        _isPlaying = true;
        // ToDO notify main controller
    }

    pc_stop() {
        _isPlaying = false;
        // ToDO notify main controller
    }
}