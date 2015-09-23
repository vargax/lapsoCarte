export const ADD_LAYER = 'add_layer';
export const GET_MAP = 'get_map';

export class GeoTimeJSONContainer{
    constructor(t, geoJSON) {
        this._t = t;
        this._geoJSON = geoJSON;
    }

    get t() {
        return this._t;
    }

    get geoJSON() {
        return this._geoJSON;
    }
}