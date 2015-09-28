import MainController from './TimeController.js'

import $ from 'jquery';
require('jquery-ui');

let _mainController;
let _timeVector;

export default class PlaybackControl {
    constructor(timeVector) {
        _mainController = new MainController();
        _timeVector = timeVector;

        this._setupControl();
    }
    _setupControl() {
        $('#time-slider').slider({
            min: _timeVector[0],
            max: _timeVector[_timeVector.length-1],
            step: 1,
            value: _timeVector[0],
            slide: function( event, ui ) {
                _mainController.slc_movedTo(ui.value);
            }
        });
    }
}

