import MainController from './GUIController.js';
import * as support from './Support.js';
import * as glbs from './../../../Globals.js';

import L from'leaflet';
require('leaflet-providers');

// ------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------
const GEOM_MAP = glbs.DATA_CONSTANTS.GEOMETRIES_MAP;

const MAP_CENTER = glbs.PROJECT.MAP_CENTER;
const MAP_ZOOM = glbs.PROJECT.MAP_ZOOM;
const MAP_ZOOM_RANGE = glbs.PROJECT.MAP_ZOOM_RANGE;

// ------------------------------------------------------------------------
// CONTROLLERS
// ------------------------------------------------------------------------
let _mainController;

// ------------------------------------------------------------------------
// VARIABLES
// ------------------------------------------------------------------------
let map;
let _geoJsonLayer;
let _gid2leafletObjectMap;

// ------------------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------------------
let leafletController = null; // --> Singleton Pattern, so groupTimeLayer instances could access the controller...
export default class LeafletController {
    constructor() {
        if (!leafletController) {
            leafletController = this;
            _mainController = new MainController();

            _gid2leafletObjectMap = new Map();
        }
        return leafletController;
    }

    // Methods exposed to my MainController (mc) ---------------------------------
    mc_colorGeometies(gid2colorArray) {
        for (let tuple of gid2colorArray)
            this.mc_colorGeometry(tuple[0],tuple[1]);
    }

    mc_colorGeometry(gid, color) {
        let leafletObject = _gid2leafletObjectMap.get(gid);
        leafletObject.layer.setStyle({
            color: color
        });
    }

    mc_initMap() {
        map = L.map('map',{zoomControl: false}).setView(MAP_CENTER, MAP_ZOOM);

        map.addLayer(new L.tileLayer.provider(glbs.PROJECT.LAYER_PROVIDER));
        map._layersMinZoom = MAP_ZOOM_RANGE[0];
        map._layersMaxZoom = MAP_ZOOM_RANGE[1];

        map.addControl(L.control.scale({imperial: false, position: 'bottomleft'}));
        map.addControl(L.control.zoom({position: 'bottomright'}));

        map.addControl(support.Widgets.getLocateWidget());

        glbs.PROJECT[glbs.DATA_CONSTANTS.LEAFLET_MAP] = map;
    }

    mc_loadGeometries() {
        try {
            _geoJsonLayer.clearLayers();
        } catch (e) {
            console.log('LeafletController.mc_loadGeometries() :! This is the first time you set geometries!');
            initGeoJsonLayer();
        }

        for (let [gid, geometry] of glbs.PROJECT[GEOM_MAP]) {
            _geoJsonLayer.addData(geometry);
        }
        _mainController.sc_ready(this);

        /*
         In Leaflet:
         - Feature is the spatial object (geoJSON feature)
         - Has a 'geometry' Object
         - Has a 'properties' Object
         - Layer is the JS object
         - Has all the methods / listeners / etc.

         In the Leaflet's geoJSON implementation each geoJSON feature is one Leaflet LAYER
         with one Leaflet FEATURE!

         The Leaflet's geoJSON object is a Leaflet's LayerGroup, in which each geoJSON feature
         is one layer of that group.
         */
        function initGeoJsonLayer() {

            _geoJsonLayer = L.geoJson([],{
                onEachFeature: geometrySetup
            });
            map.addLayer(_geoJsonLayer);

            function geometrySetup(feature, layer) {
                layer.gid = feature['properties'][glbs.PROJECT.COLUMN_GID];
                layer.mainController = leafletController;
                layer.setStyle(glbs.PROJECT.DEFAULT_STYLE);

                _gid2leafletObjectMap.set(layer.gid, {
                    layer: layer,
                    feature: feature
                });

                layer.on({
                    mouseover: geometryOver,
                    mouseout: geometryOut
                });
            }

            function geometryOver() {
                this.mainController.sc_geometryOver(this.gid);
            }

            function geometryOut() {
                this.mainController.sc_geometryOut(this.gid);
            }
        }
    }

    // Methods exposed to all my subcontrollers (sc) --------------------------
    sc_geometryOver(gid) {
        _mainController.sc_spatialObjectOver(gid);
    }

    sc_geometryOut(gid) {
        _mainController.sc_spatialObjectOut(gid);
    }
}


