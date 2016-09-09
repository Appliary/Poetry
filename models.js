const Mongo = require( 'promised-mongo' ),
    Log = require( './lib/methods/log' ),
    local = 'localhost:27017/database';

// Are the env. variables set ?
let url = process.env.DATABASE_PORT || process.env.database_port;
if ( url ) url += '/database';
else url = process.env.DATABASE || process.env.database;

// Otherwise, localhost default config
if ( !url ) url = local;

if( ~url.indexOf('://') )
    url = url.split('://', 2)[1];

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
