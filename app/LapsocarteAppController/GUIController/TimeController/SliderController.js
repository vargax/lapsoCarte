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
            min: 0,
            max: _timeVector.length-1,
            step: 1,
            value: 0,
            animate: true,
            slide: function( event, ui ) {
                _mainController.slc_movedTo(_timeVector[ui.value]);
            }
        });
    }
}

