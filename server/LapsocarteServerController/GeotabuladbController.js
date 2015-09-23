import MainController from './LapsocarteServerController.js'
import GeotabulaDB from 'geotabuladb'

let _mainController;
let _geo;

export default class GeotabuladbController {
    constructor() {
        _mainController = new MainController();
        _geo = new GeotabulaDB();
    }

    mc_init() {
        _geo.setCredentials({
            user: 'lapsocarte',
            password: 'lapsocarte',
            database: 'lapsocarte'
        });
    }

    mc_getMap() {
        let parameters = {
            tableName: 'population',	// The name of the table we are going to query
            geometry: 'geom', 			// The name of the column who has the geometry
            where: 't = '+ 1,           // The name of the column who has the time
            properties: 'all'			// Additional columns we want to recover --> For specific columns you have to pass columns' names as an Array
        };

        _geo.geoQuery(parameters, callBack);

        function callBack(geoJSON) {
            _mainController.gtc_giveMap(geoJSON);
        }
    }
}
