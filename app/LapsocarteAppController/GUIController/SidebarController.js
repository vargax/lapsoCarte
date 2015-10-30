import MainController from './GUIController.js';
import * as support from './Support.js';

import L from'leaflet';
import $ from 'jquery';

let _mainController;
let map;

export default class SidebarController {
    constructor() {
        _mainController = new MainController();
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_syncSidebar() {
        /* Empty sidebar features */
        let featureList = $("#feature-list tbody");
        featureList.empty();

        try {
            let features = _mainController.sc_getFeatures();
            for (let [id,feature] of features) {
                if (map.getBounds().contains(feature.getBounds())) {
                    featureList.append(support.HTMLHelper.genSidebarEntry(id,feature));
                }
            }
        } catch(e) {
            console.log(':! I dont get an array full of features as I expect...')
        }
    }

    mc_init() {
        map = _mainController.sc_getMap();

        map.on('moveend', this.mc_syncSidebar);

        //$(document).on("click", ".feature-row", function(e) {
        //    $(document).off("mouseout", ".feature-row", clearHighlight);
        //    sidebarClick(parseInt($(this).attr("id"), 10));
        //});

        $(document).on("mouseover", ".feature-row", function(e) {
            _mainController.sc_spatialObjectOver($(this).attr("id"));
        });

        $(document).on("mouseout", ".feature-row", function(e) {
            _mainController.sc_spatialObjectOut($(this).attr("id"));
        });
    }

    _sidebarClick(id) {
        var layer = markerClusters.getFeatures(id);
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
        /* Hide sidebar and go to the map on small screens */
        if (document.body.clientWidth <= 767) {
            $("#sidebar").hide();
            map.invalidateSize();
        }
    }
}