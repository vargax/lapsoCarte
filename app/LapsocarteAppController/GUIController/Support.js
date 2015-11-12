import L from'leaflet';
import $ from 'jquery';
import Handlebars from 'handlebars'

import * as glbs from './../../../Globals.js';

// Templates to load: Once loaded the value becomes the handlebars compiled template!
const templates = {
    select: 'select.hbs'
};

export class HandlebarsHelper {
    static compileSelect(options) {
        let context = {option: []};

        for (let option of options)
            context.option.push({value: option});

        return templates.select(context);
    }

    static loadTemplates() {
        for (let property in templates) {
            $.get('templates/'+templates[property], function(response) {
                templates[property] = Handlebars.compile(response);
            });
        }
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