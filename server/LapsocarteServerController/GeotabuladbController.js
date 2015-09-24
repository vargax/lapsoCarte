import * as crypto from 'crypto'

import MainController from './LapsocarteServerController.js'
import * as glbs from '../../Globals.js'
import GeotabulaDB from 'geotabuladb'

const logString = 'GeotabuladbController';
const logOK  = ' :: ';
const logERR = ' !! ';

let _mainController;
let _geo;
let _queries;
let _results;

export default class GeotabuladbController {
    constructor() {
        _mainController = new MainController();
        _geo = new GeotabulaDB();
        _queries = new Map();
        _results = new Map();
    }

    mc_init() {
        _geo.setCredentials({
            user: 'lapsocarte',
            password: 'lapsocarte',
            database: 'lapsocarte'
        });
    }

    mc_getGeoTimeJsonLayers(timeRange) {
        let log = '.mc_getGeoTimeJsonLayers('+timeRange+')';

        let functionCallHash = GeotabuladbController.genHash(timeRange);
        let queriesResults = [];
        _results.set(functionCallHash, queriesResults);

        let queries = 0;
        for (let t = timeRange[0]; t <= timeRange[1]; t++) {
            let parameters = {
                // ToDo population should be dynamic...
                tableName: 'population',	// The name of the table we are going to query
                geometry: 'geom', 			// The name of the column who has the geometry
                where: 't = '+ t,           // The name of the column who has the time
                properties: 'all'			// Additional columns we want to recover --> For specific columns you have to pass columns' names as an Array
            };

            let queryHash = _geo.geoQuery(parameters, callBack);
            _queries.set(queryHash, t);
            queries++;
        }

        function callBack(geoJSON, queryHash) {
            let t = _queries.get(queryHash);
            _queries.delete(queryHash);

            let geoTimeJsonLayer = glbs.GeoTimeJSON.pack(t, geoJSON);
            _results.get(functionCallHash).push(geoTimeJsonLayer);

            queries--;
            console.log(logString+log+logOK+' '+queries+' remaining...')
            if (queries == 0) {
                sendResults(functionCallHash);
            }
        }

        function sendResults(functionCallHash) {
            console.log(logString+log+'.sendResults('+functionCallHash+')');

            let result = _results.get(functionCallHash);
            _results.delete(functionCallHash);

            _mainController.gtc_giveGeoTimeJsonLayers(result);
        }
    }

    static genHash(object) {
        let string = object.toString()+Math.random();

        let hash = crypto.createHash('sha1');
        hash.update(string);

        return hash.digest('hex');
    }
}
