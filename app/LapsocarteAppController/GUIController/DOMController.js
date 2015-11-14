import * as glbs from './../../../Globals.js'
import * as support from './Support.js'
import MainController from './GUIController.js'

import $ from 'jquery'

let _mainController;

export default class DOMController {
    constructor() {
        _mainController = new MainController();
    }

    mc_initDOM() {

    }

    mc_setHows(howsArray) {
        let jQueryId = '#'+support.DOM_CONSTANTS.HOWs_CONTAINER_ID;
        this._appendSelect(jQueryId, howsArray);

        $(jQueryId).on({
            change: function(){
                let newHow = $(this).val();
                let mainController = new MainController();
                mainController.sc_howChange(newHow);
            }
        }, 'select');
    }

    mc_setWhats(whatsArray) {
        let jQueryId = '#'+support.DOM_CONSTANTS.WHATs_CONTAINER_ID;
        this._appendSelect(jQueryId, whatsArray);

        $(jQueryId).on({
            change: function(){
                let newWhat = $(this).val();
                let mainController = new MainController();
                mainController.sc_whatChange(newWhat);
            }
        }, 'select');
    }

    _appendSelect(containerId, options) {
        let select = support.HandlebarsHelper.compileSelect(options);
        $(containerId).empty();
        $(containerId).append(select);
    }
}