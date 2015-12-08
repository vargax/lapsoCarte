import * as support from './Support.js'

import MainController from './GUIController.js'
import L from'leaflet'

let _mainController;

let leafletControl;
export default class InfoWidgetController {
    constructor() {
        _mainController = new MainController();
        leafletControl = new L.control();

        leafletControl.setPosition('topright');
        leafletControl.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        leafletControl.update = function(){}
    }

    mc_updateInfo(data) {
        leafletControl._div.innerHTML = support.HandlebarsHelper.compileInfoWidget(data);
    }

    mc_getLeafletControl() {
        _mainController.sc_ready(this);
        return leafletControl;
    }
}