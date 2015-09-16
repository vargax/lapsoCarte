import MainController from './MainController.js'

import $ from 'jquery';
import Typeahead from 'typeahead';

global.jQuery = require('jquery');
require('bootstrap');
require('handlebars');
require('list.js');

let mainController;
let map;

var featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];

export default class BootleafController {
    constructor() {
        mainController = new MainController();
        map = mainController.blc_getMap();
    }

    initGUI() {
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