import MainController from './MainController.js'
import widgets from './widgets.js';

import L from'leaflet';
require('leaflet-providers');

let mainController;
let _map;
let _infoWidget;

export default class LeafletController {
    constructor() {
        mainController = new MainController();
        this._initMap();
    }

    getMap() {
        return _map;
    }

    _initMap() {
        let mapInitParameters = mainController.llc_getInitialMapParameters();
        let center = mapInitParameters[0];
        let zoom = mapInitParameters[1];
        let zoomRange =   mapInitParameters[2];

        _map = L.map('map',{zoomControl: false}).setView(center, zoom);
        _map.addLayer(new L.tileLayer.provider('Esri.WorldGrayCanvas'));
        _map._layersMinZoom = zoomRange[0];
        _map._layersMaxZoom = zoomRange[1];

        _map.addControl(L.control.scale({imperial: false}));
        _map.addControl(L.control.zoom({position: 'bottomright'}));

        _map.addControl(widgets.getLocateWidget());

        _infoWidget = widgets.getInfoWidget();
        _map.addControl(_infoWidget);
    }

}