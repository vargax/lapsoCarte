import MainController from './TimeController.js'
import * as glbs from './../../../../Globals.js'

import $ from 'jquery';
require('jquery-ui');

let _mainController;
let timeVector;

export default class PlaybackControl {
    constructor() {
        _mainController = new MainController();
        timeVector = glbs.PROJECT[glbs.DATA_CONSTANTS.TIME_VECTOR];

        this._setupControl();
    }
    _setupControl() {
        $('#time-slider').slider({
            min: 0,
            max: timeVector.length-1,
            step: 1,
            value: 0,
            animate: true,
            slide: function( event, ui ) {
                _mainController.slc_movedTo(timeVector[ui.value]);
            }
        });
    }
}

