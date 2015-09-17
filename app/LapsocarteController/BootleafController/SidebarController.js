import MainController from './BootleafController.js';
import L from'leaflet';
import $ from 'jquery';

let mainController;
let map;

export default class SidebarController {
    constructor() {
        mainController = new MainController();
        map = mainController.sbc_getMap();
        map.on('moveend', this.mc_syncSidebar);
    }

    // Methods exposed to my MainController (mc) ------------------------------
    mc_syncSidebar() {
        console.log('CALLING!');
        /* Empty sidebar features */
        $("#feature-list tbody").empty();

        let layers = mainController.sbc_getLayers();
        for (let layer in layers) {
            if (map.hasLayer(layer) && map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    }

    // Private methods --------------------------------------------------------
    _sidebarClick(id) {
        var layer = markerClusters.getLayer(id);
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
        /* Hide sidebar and go to the map on small screens */
        if (document.body.clientWidth <= 767) {
            $("#sidebar").hide();
            map.invalidateSize();
        }
    }
}