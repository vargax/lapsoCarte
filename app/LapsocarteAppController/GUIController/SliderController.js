import MainController from './GUIController.js'
import * as glbs from './../../../Globals.js'

import noUiSlider from 'nouislider'

let _mainController;

let _slider;
let _timeVector;

export default class SliderController {
    constructor() {
        _mainController = new MainController();
    }

    mc_initSlider() {
        _slider = document.getElementById('time-slider');

        noUiSlider.create(_slider, {
            start: 0.5,
            range: {
                min: 0,
                max: 1
            }
        });

        _slider.setAttribute('disabled', true);
        _mainController.sc_ready(this);
    }

    mc_update(whensVector) {
        _timeVector = whensVector;
        _slider.noUiSlider.destroy();
        this._setupControl();
        _slider.removeAttribute('disabled');
    }

    _setupControl() {
        let range = {};

        let min = _timeVector[0];
        let max = _timeVector[_timeVector.length-1];

        range['min'] = min;
        for (let i = 1; i < _timeVector.length-1; i++) {
            let value = _timeVector[i];
            let key = ((value/max)*100)+'%';
            range[key] = value;
        }
        range['max'] = max;

        // Object instantiation
        noUiSlider.create(_slider, {
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
        let handle = _slider.querySelector('.noUi-origin');
        handle.setAttribute('tabindex', 0);
        handle.addEventListener('click', function(){
            this.focus();
        });
        handle.addEventListener('keydown', function( e ) {
            let value = Number.parseInt(_slider.noUiSlider.get());
            let index = _timeVector.indexOf(value);

            switch ( e.which ) {
                case 37:
                    _slider.noUiSlider.set(_timeVector[index - 1]);
                    break;
                case 39:
                    _slider.noUiSlider.set(_timeVector[index + 1]);
                    break;
            }
        });

        // On update handler
        _slider.noUiSlider.on('update', function(values, handle) {
            // ToDo Here I'm assuming time is always a number! --> It would be problems if that is not the case...
            let sliderPosition = Number.parseFloat(values[handle]);
            _mainController.sc_whenChange(sliderPosition);
        });
    }
}

