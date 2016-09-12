const Mongo = require( 'promised-mongo' ),
    Log = require( './lib/methods/log' ),
    local = 'localhost/database';

// Are the env. variables set ?
let url = process.env.DATABASE || process.env.database;

// Try the default rancher config
if ( !url ) {
    if (
        process.env.MONGODB_MONGO_CLUSTER_1_PORT &&
        process.env.MONGODB_MONGO_CLUSTER_2_PORT && process.env.MONGODB_MONGO_CLUSTER_3_PORT
    ) url = 'mongodb://mongodb_mongo-cluster_1,mongodb_mongo-cluster_2,mongodb_mongo-cluster_3/database?replicaSet=' + ( process.env.replicaset || 'rs0' );
    else {
        url = process.env.DATABASE_PORT || process.env.database_port;
        if ( url ) {
            url += '/database';
            if ( ~url.indexOf( '://' ) )
                url = url.split( '://', 2 )[ 1 ];
        }
    }
}


// Otherwise, localhost default config
if ( !url ) url = local;

Log.info( 'Using MongoDB', url );

module.exports = new Proxy( Mongo( url ), {
    get( db, model ) {
        if ( typeof model !== 'string' ) return undefined;

        model = model.toLowerCase();
        if ( model.charAt( model.length - 1 ) != 's' )
            model += 's';

        return db[ model ];
    }
} );
