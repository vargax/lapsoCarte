// ---------------------------------------------------------------------------------------------------------------------
// Project CONSTANTS
// ---------------------------------------------------------------------------------------------------------------------

// DEMO ----------------------------------------------------------------------------------------------------------------
let demo = {
    PROJECT: 'demo',
    PORT: 8080,

    TABLE_DATA: 'demo',

    COLUMN_HOW: 'how_column',
    COLUMN_WHAT: 'what_column',
    COLUMN_WHEN: 'when_column',
    COLUMN_WHERE: 'where_column',
    COLUMN_DATA: 'data_column',

    TABLE_GEOM: 'shape',
    COLUMN_GEOM: 'geom',

    TIME_RANGE: range(0,30),

    MAP_CENTER: [4.66198, -74.09866],
    MAP_ZOOM: 11,
    MAP_ZOOM_RANGE: [10, 16],
    LAYER_PROVIDER: 'Esri.WorldGrayCanvas',

    DEFAULT_STYLE: {color: '#6baed6', fillOpacity: 0.8, weight: 1.2},
    FOCUSED_COLOR: '#74c476',
    CHOROPLETH_RANGE: ['#FFFFCC', '#800026']

};
demo.DB_USER = demo.PROJECT;
demo.DB_PASS = demo.PROJECT;
demo.DB_NAME = demo.PROJECT;

export const PROJECT = demo;

// ---------------------------------------------------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------------------------------------------------
function range(begin, end, step = 1) {
    let result = [];
    for (let i = begin; i <= end; i+= step)
        result.push(i);

    return result;
}

// ---------------------------------------------------------------------------------------------------------------------
// Objects Name Constants
// ---------------------------------------------------------------------------------------------------------------------
export const DATA_KEYs = {
    /*
     Geometries map:
     |-> key: COLUMN_WHERE
     |-> Element: geoJSON
     */
    WHEREs_MAP:   'lpc_WHEREs_MAP',

    /*
     4 dimensions map:
     |-> First  key -> HOW
     |-> Second key -> WHAT  -> data set
     |-> Third  key -> WHEN  -> t
     |-> Fourth key -> WHERE -> gid.
     |-> Element    -> The actual data...
     */
    DATA_MAP: 'lpc_DATA_MAP',

    /*
     Multidimensional map with cumulative data descriptive statistics:
     EXAMPLE:
     To get the DATA_VECTOR at WHAT level:
        descStats.get(givenHow).get(givenWhat).get(DS_DATA_VECTOR)
     To get the DATA_VECTOR but at WHEN level:
        descStats.get(givenHow).get(givenWhat).get(givenWhen).get(DS_DATA_VECTOR)

     Note that given the hierarchically DATA_MAP implementation:
        - There are not descriptive stats at WHERE level.
        - Descriptive statistics at HOW level are available but in general doesn't make
        statistical sense (they are comparing apples and oranges).
     */
    DESCRIPTIVE_STATS: 'lpc_DESCRIPTIVE_STATS',
    DS_MIN: 'lpc_MIN',
    DS_MAX: 'lpc_MAX',
    DS_MEAN: 'lpc_AVERAGE',
    DS_KEYS_VECTOR: 'lpc_KEYS_VECTOR',
    DS_DATA_VECTOR: 'lpc_DATA_VECTOR',

    /*
     Key to locate the INSTANCE in the PROJECT object
     */
    LPC_INSTANCE_KEY: 'lpc_INSTANCE_KEY',
    /*
     Keys to locate the objects inside the INSTANCE object
     */
    LPC_INSTANCE_STATE: {
        INSTANCE: 'lpc_INSTANCE',

        CURRENT_HOW: 'lpc_CURRENT_HOW',
        CURRENT_WHAT: 'lpc_CURRENT_WHAT',
        CURRENT_WHEN: 'lpc_CURRENT_WHEN',

        DATA_MAP: 'lpc_DATA_MAP',
        WHAT_STATS: 'lpc_WHAT_STATS',
        WHEN_STATS: 'lpc_WHEN_STATS',

        LEAFLET_MAP: 'lpc_LEAFLET_MAP'             // Leaflet MAP object
    }
};

// ---------------------------------------------------------------------------------------------------------------------
// Server-Client socket CONSTANTS (sck)
// ---------------------------------------------------------------------------------------------------------------------
export const SOCKETio_CONSTANTS = {
    INIT: 'init',
    GIVE_DATA:  'give_data',
    GIVE_GEOM:  'give_geom',
    GIVE_STATS: 'give_stats'
};