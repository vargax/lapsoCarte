import L from'leaflet';

var info;
var time;

function getInfoWidget() {
    info = new L.control();
    info.setPosition('topright');

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (sptlObjAttr) {
        // ToDo :: Put this HTML outside the JS code... (something like the support.js crack for the css')
        let html = '<h4> Data </h4>';
        for (let item in sptlObjAttr) {
            html += '<b>' + item + '</b> ' + sptlObjAttr[item] + '</b> <br />';
        }
        this._div.innerHTML = html;
    };
    return info;
}

function getTimeWidget() {
    time = new L.control();
    time.setPosition('bottomleft');

    time.onAdd = function (map) {
        let container = L.DomUtil.create('div', 'time');
        container.innerHTML = '<div id="chart"></div>';
        return container;
    };

    return time;
}

module.exports = {
    getInfoWidget: getInfoWidget,
    getTimeWidget: getTimeWidget
};