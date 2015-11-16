import * as support from './Support.js'
import MainController from './GUIController.js'

import $ from 'jquery'

let _mainController;

export default class DOMController {
    constructor() {
        _mainController = new MainController();
    }

    mc_initDOM() {
        let howsContainerId = '#'+support.DOM_CONSTANTS.HOWs_CONTAINER_ID;
        $(howsContainerId).on({
            change: function(){
                let newHow = $(this).val();
                let mainController = new MainController();
                mainController.sc_howChange(newHow);
            }
        }, 'select');

        let whatsContainerId = '#'+support.DOM_CONSTANTS.WHATs_CONTAINER_ID;
        $(whatsContainerId).on({
            change: function(){
                let newWhat = $(this).val();
                let mainController = new MainController();
                mainController.sc_whatChange(newWhat);
            }
        }, 'select');
    }

    mc_setHows(howsArray) {
        let jQueryId = '#'+support.DOM_CONSTANTS.HOWs_CONTAINER_ID;
        this._appendSelect(jQueryId, howsArray);

    }

    mc_setWhats(whatsArray) {
        let jQueryId = '#'+support.DOM_CONSTANTS.WHATs_CONTAINER_ID;
        this._appendSelect(jQueryId, whatsArray);

    }

    _appendSelect(containerId, options) {
        let select = support.HandlebarsHelper.compileSelect(options);
        $(containerId).empty();
        $(containerId).append(select);
    }
}