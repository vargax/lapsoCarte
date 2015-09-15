import L from'leaflet';

var info;

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

module.exports = {
    getInfoWidget: getInfoWidget
};