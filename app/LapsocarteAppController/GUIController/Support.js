import * as glbs from './../../../Globals.js';

import L from'leaflet';
import $ from 'jquery';
import Handlebars from 'handlebars'
import math from 'mathjs'

// Templates to load: Once loaded the value becomes the handlebars compiled template!
const templates = {
    select: 'select.hbs'
};

export const DOM_CONSTANTS = {
    HOWs_CONTAINER_ID: 'lpc-hows-selector-container',
    WHATs_CONTAINER_ID: 'lpc-whats-selector-container'
};

export class HandlebarsHelper {
    static compileSelect(options) {
        let context = {
            option: []
        };

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

export class Choropleth {
    constructor(rgbRange, dataRange) {
        this.min = dataRange[0];
        this.delta = dataRange[1] - this.min;

        let rgbMin = Choropleth.hexString2array(rgbRange[0]);
        let rgbMax = Choropleth.hexString2array(rgbRange[1]);
        let rgbDelta = math.subtract(rgbMax, rgbMin);

        this.rgbMin = rgbMin;
        this.rgbDelta = rgbDelta;
    }

    giveColor(rawData) {

        if(!Number.isFinite(rawData)) throw rawData+' not a valid number!';

        let normalizedValue = (rawData - this.min) / this.delta;
        let segment = math.add(this.rgbMin, math.dotMultiply(normalizedValue, this.rgbDelta));

        return Choropleth.array2hexString(segment);
    }

    static hexString2array(rgbString) {
        let red   = Number.parseInt(rgbString.slice(1,3), 16),
            green = Number.parseInt(rgbString.slice(3,5), 16),
            blue  = Number.parseInt(rgbString.slice(5,7), 16);

        return [red, green, blue];
    }

    static array2hexString(array) {
        return '#'
            + (Math.round(array[0])).toString(16)
            + (Math.round(array[1])).toString(16)
            + (Math.round(array[2])).toString(16);
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