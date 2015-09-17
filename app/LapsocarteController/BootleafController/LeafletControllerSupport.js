import L from'leaflet';

export class LayerStyle {
    static getFocusedLayerStyle() {
        return {
            color: '#FFFF00'
        }
    }

    static choroplethStyle(feature) {
        function choroplethColor(d) {
            return d > 8000 ? '#800026' :
                d > 7000 ? '#BD0026' :
                    d > 6000 ? '#E31A1C' :
                        d > 5000 ? '#FC4E2A' :
                            d > 4000 ? '#FD8D3C' :
                                d > 3000 ? '#FEB24C' :
                                    d > 2000 ? '#FED976' :
                                        '#FFEDA0';
        }

        return {
            color: choroplethColor(feature.properties.population),
            weight: 1.2
        }
    }
}

export class Widgets {
    static getInfoWidget() {
        let info = new L.control();
        info.setPosition('topright');

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        info.update = function (sptlObjAttr) {
            // ToDo :: Put this HTML into another place...
            let html = '<h4> Data </h4>';
            for (let item in sptlObjAttr) {
                html += '<b>' + item + '</b> ' + sptlObjAttr[item] + '</b> <br />';
            }
            this._div.innerHTML = html;
        };
        return info;
    }

    static getLocateWidget() {
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
}