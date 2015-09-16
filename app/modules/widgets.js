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

function getLocateWidget() {
    require('leaflet.locatecontrol');
    let locateControl = L.control.locate({
        position: "bottomright",
        drawCircle: true,
        follow: true,
        setView: true,
        keepCurrentZoomLevel: true,
        markerStyle: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8
        },
        circleStyle: {
            weight: 1,
            clickable: false
        },
        icon: "fa fa-location-arrow",
        metric: false,
        strings: {
            title: "My location",
            popup: "You are within {distance} {unit} from this point",
            outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
        },
        locateOptions: {
            maxZoom: 18,
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        }
    });
    return locateControl;
}

module.exports = {
    getInfoWidget: getInfoWidget,
    getLocateWidget: getLocateWidget
};