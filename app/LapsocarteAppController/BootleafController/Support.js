import L from'leaflet';
import $ from 'jquery';

//const SIDEBAR_FEATURE_TITLE = 'nomb_barr'; // lapsocarte
const SIDEBAR_FEATURE_TITLE = 'gid';         // tomsa

export class LayerStyle {
    static getFocusedLayerStyle() {
        return {
            //color: '#0000FF' // lapsocarte
            color: 'green' // lapsocarte
        }
    }

    static choroplethStyle(feature) {
        // ToDo implement dynamic chroplethColor function...
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

        function fixedColor(d) {
            return  d = 0 ? 'gray' :
                    d = 1 ? 'red'   :
                    d = 2 ? 'blue'  :
                    d = 3 ? 'yellow': 'black';
        }

        return {
            // ToDo change hard-coded feature property 'population'... Should be dynamic...
            //color: choroplethColor(feature.feature.properties['population']), // lapsocarte
            color: fixedColor(feature.feature.properties['currentpop']),   // tomsa
            weight: 1.2
        }
    }
}

export class HTMLHelper {
    static genSidebarEntry(featureId, feature) {
        let center = feature.getBounds().getCenter();
        // ToDo hard-coded feature property name!!... Should be dynamic...
        let html = '<tr class="feature-row" id="'+featureId + '" lat="' + center.lat + '" lng="' + center.lng + '">'
            + '<td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td>'
            + '<td class="feature-name">' + feature.feature.properties[SIDEBAR_FEATURE_TITLE] + '</td>'
            + '<td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>';
        return html;
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
        info.update = function (feature) {
            let html = '<h4> Data </h4>';
            if (feature !== undefined) {
                // ToDo :: Put this HTML in another place...
                let sptlObjAttr = feature.feature.properties;
                for (let item in sptlObjAttr) {
                    html += '<b>' + item + '</b> ' + sptlObjAttr[item] + '</b> <br />';
                }
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