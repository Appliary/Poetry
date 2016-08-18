const Waterline = require( 'waterline' );
const log = require( './log.js' );

// Cache for models
let models = {};

// Waterline default configuration
let config = {

    adapters: {
        'disk': require( 'sails-disk' ),
        'mongodb': require( 'sails-mongo' )
    },

    connections: {
        default: {
            adapter: 'disk',
            filePath: '.db/'
        }
    }

};

// Use mongo ?
if ( process.env.DATABASE ) {
    log.verbose( 'Using MongoDB', process.env.DATABASE_PORT );
    config.connections.default = {
        adapter: 'mongodb',
        host: 'mongodb',
        database: 'database'
    }
}

module.exports = function model( name, cb ) {

    let p = new Promise( ( resolve, reject ) => {

        // Use cached first
        if ( models[ name ] )
            return resolve( models[ name ].collections[ name ] );

        log.silly( 'Create new ORM instance for model', name );

        // Create new instance
        let w = new Waterline();
        w.loadCollection( Waterline.Collection.extend( {
            identity: name,
            connection: 'default',
            schema: false
        } ) );
        w.initialize( config, ( err, orm ) => {

            if ( err ) throw log.error( 'Model error', err );

            // Save and return newly created instance
            models[ name ] = w;
            resolve( models[ name ].collections[ name ] );

        } );

    } );

    if (cb) p.then(cb);
    return p;

};
