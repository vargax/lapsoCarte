import L from'leaflet';
import $ from 'jquery';

import * as glbs from './../../../Globals.js';

export class HTMLHelper {
    static genSidebarEntry(featureId, feature) {
        let center = feature.getBounds().getCenter();
        let html = '<tr class="feature-row" id="'+featureId + '" lat="' + center.lat + '" lng="' + center.lng + '">'
            + '<td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td>'
            + '<td class="feature-name">' + feature.feature.properties[glbs.PROJECT.COLUMN_NAME] + '</td>'
            + '<td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>';
        return html;
    }
}

export class Widgets {
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