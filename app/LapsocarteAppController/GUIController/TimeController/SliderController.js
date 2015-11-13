import MainController from './TimeController.js'
import * as glbs from './../../../../Globals.js'

import $ from 'jquery'
import noUiSlider from 'nouislider'

const WHENs_VECTOR  = glbs.DATA_CONSTANTS.LPC_INSTANCE_STATE.WHENs_VECTOR;

let instance;

let _mainController;
let timeVector;

export default class PlaybackControl {
    constructor() {
        _mainController = new MainController();

        const INSTANCE_KEY = glbs.DATA_CONSTANTS.LPC_INSTANCE_KEY;
        instance = glbs.PROJECT[INSTANCE_KEY];

        timeVector = instance[WHENs_VECTOR];

        this._setupControl();
    }
    _setupControl() {
        let range = {};

        let min = timeVector[0];
        let max = timeVector[timeVector.length-1];

        range['min'] = min;
        for (let i = 1; i < timeVector.length-1; i++) {
            let value = timeVector[i];
            let key = ((value/max)*100)+'%';
            range[key] = value;
        }
        range['max'] = max;

        console.dir(range);

        let slider = document.getElementById('time-slider');

        // Object instantiation
        noUiSlider.create(slider, {
            start: range['min'],
            snap: true,
            range: range,
            connect: 'lower',
            pips: {
                mode: 'range',
                density: 3
            }
        });

        // Click and keyboard handlers
        let handle = slider.querySelector('.noUi-origin');
        handle.setAttribute('tabindex', 0);
        handle.addEventListener('click', function(){
            this.focus();
        });
        handle.addEventListener('keydown', function( e ) {
            let value = Number.parseInt(slider.noUiSlider.get());
            let index = timeVector.indexOf(value);

            switch ( e.which ) {
                case 37:
                    slider.noUiSlider.set(timeVector[index - 1]);
                    break;
                case 39:
                    slider.noUiSlider.set(timeVector[index + 1]);
                    break;
            }
        });

        // On update handler
        slider.noUiSlider.on('update', function(values, handle) {
            // ToDo Here I'm assuming time is always an integer! --> It would be problems if that is not the case...
            let sliderPosition = Number.parseFloat(values[handle]);
            _mainController.slc_movedTo(sliderPosition);
        });
    }
}

