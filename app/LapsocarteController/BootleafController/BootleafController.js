import MainController from './../LapsocarteController.js';
import LeafletController from './LeafletController.js';

import $ from 'jquery';
import Typeahead from 'typeahead';

global.jQuery = require('jquery');
require('bootstrap');
require('handlebars');
require('list.js');

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const lc_MAP_CENTER = [4.66198, -74.09866];
const lc_MAP_ZOOM = 11;
const lc_MAP_ZOOM_RANGE = [10, 16];

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let mainController;
let leafletController;
let map;

let bootleafController = null; // --> Singleton Pattern...
export default class BootleafController {
    constructor() {
        if (!bootleafController) {
            bootleafController = this;

            mainController = new MainController();
            leafletController = new LeafletController();
            map = leafletController.mc_getMap();
        }
        return bootleafController;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_initGUI() {
        $(window).resize(function() {
            sizeLayerControl();
        });

        $(document).on("click", ".feature-row", function(e) {
            $(document).off("mouseout", ".feature-row", clearHighlight);
            sidebarClick(parseInt($(this).attr("id"), 10));
        });

        $(document).on("mouseover", ".feature-row", function(e) {
            highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
        });

        $(document).on("mouseout", ".feature-row", clearHighlight);

        $("#about-btn").click(function() {
            $("#aboutModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#full-extent-btn").click(function() {
            map.fitBounds(boroughs.getBounds());
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#legend-btn").click(function() {
            $("#legendModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#login-btn").click(function() {
            $("#loginModal").modal("show");
            $(".navbar-collapse.in").collapse("hide");
            return false;
        });

        $("#list-btn").click(function() {
            $('#sidebar').toggle();
            map.invalidateSize();
            return false;
        });

        $("#nav-btn").click(function() {
            $(".navbar-collapse").collapse("toggle");
            return false;
        });

        $("#sidebar-toggle-btn").click(function() {
            $("#sidebar").toggle();
            map.invalidateSize();
            return false;
        });

        $("#sidebar-hide-btn").click(function() {
            $('#sidebar').hide();
            map.invalidateSize();
        });

        $("#loading").hide();
    }

    mc_addTimeLayer(time, geoJSON) {
        leafletController.mc_addTimeLayer(time, geoJSON);
        leafletController.mc_setTimeLayer(time);
    }

    // LeafletController (llc) ------------------------------------------------
    static llc_getInitialMapParameters() {
        return [lc_MAP_CENTER, lc_MAP_ZOOM, lc_MAP_ZOOM_RANGE];
    }
}

function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
    highlight.clearLayers();
}

function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

function syncSidebar() {
    /* Empty sidebar features */
    $("#feature-list tbody").empty();
    /* Loop through theaters layer and add only features which are in the map bounds */
    theaters.eachLayer(function (layer) {
        if (map.hasLayer(theaterLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });
    /* Loop through museums layer and add only features which are in the map bounds */
    museums.eachLayer(function (layer) {
        if (map.hasLayer(museumLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });
    /* Update list.js featureList */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}