import L from'leaflet'

let leafletControl;
export default class InfoWidgetController {
    constructor() {
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
        let html = '<h4> Data </h4>';
        if (data !== undefined) {
            // ToDo :: Put this HTML in another place...
            for (let item in data) {
                html += '<b>' + item + '</b> ' + data[item] + '</b> <br />';
            }
        }
        leafletControl._div.innerHTML = html;
    }

    mc_getLeafletControl() {
        return leafletControl;
    }
}