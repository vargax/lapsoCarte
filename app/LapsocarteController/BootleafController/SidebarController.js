import MainController from './BootleafController.js';
import * as support from './Support.js';

import L from'leaflet';
import $ from 'jquery';

let mainController;
let map;

export default class SidebarController {
    constructor() {
        mainController = new MainController();
        map = mainController.sbc_getMap();
        this._init();
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_syncSidebar() {
        /* Empty sidebar features */
        let featureList = $("#feature-list tbody");
        featureList.empty();

        let features = mainController.sbc_getFeatures();
        for (let [id,feature] of features) {
            if (map.getBounds().contains(feature.getBounds())) {
                featureList.append(support.HTMLHelper.genSidebarEntry(id,feature));
            }
        }
    }

    // Private methods --------------------------------------------------------
    _init() {
        map.on('moveend', this.mc_syncSidebar);

        //$(document).on("click", ".feature-row", function(e) {
        //    $(document).off("mouseout", ".feature-row", clearHighlight);
        //    sidebarClick(parseInt($(this).attr("id"), 10));
        //});

        $(document).on("mouseover", ".feature-row", function(e) {
            console.log('Highligh '+$(this).attr("id"));
            mainController.sc_featureOver(Number.parseInt($(this).attr("id")));
            //highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
        });

        //$(document).on("mouseout", ".feature-row", clearHighlight);
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