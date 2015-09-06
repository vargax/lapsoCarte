// ------------------------------------------------------
// Variables
// ------------------------------------------------------
var map;								// The map we are going to visualize...
var layersControl = L.control.layers(); // Variable to handle the layers in the map...
var info = L.control();                 // Variable to show additional information about the selected spatial object.

// ------------------------------------------------------
// Functions
// ------------------------------------------------------
function createMap() {
    map = L.map('map').setView([4.66198, -74.09866], 11);  				// Initial position in the map (lat, long, zoom)
    map.addLayer(new L.TileLayer.provider('Esri.WorldGrayCanvas'));     // The map provider we are going to use --> You must import the corresponding library in index.html
    map._layersMaxZoom=16;												// Define the maximum zoom in the map
    map._layersMinZoom=10;

    L.control.scale({				// Manage the scale:
        position : 'bottomleft',	// .. where is it located
        imperial : false			// .. use the metric system (default is imperial)
    }).addTo(map);

    info.addTo(map);                // Here we add the info DIV to the map itself
}