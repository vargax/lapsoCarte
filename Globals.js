export const ADD_LAYER = 'add_layer';
export const GET_LAYERS = 'get_layers';

export class GeoTimeJSON {
    static pack (t, geoJSON) {
        geoJSON['time'] = t;
        return geoJSON;
    }

    static unpack(geoTimeJSON) {
        let t = geoTimeJSON['time'];
        delete geoTimeJSON['time'];
        return [t, geoTimeJSON];
    }
}