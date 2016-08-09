const Waterline = require( 'waterline' );
const log = require( './log.js' );

// Cache for models
let models = {};

// Waterline default configuration
let config = {

    adapters: {
        'memory': require( 'sails-memory' )
    },

    connections: {
        default: {
            adapter: 'memory'
        }
    }

};

module.exports = function model( name ) {

    // Use cached first
    if ( models[ name ] )
        return models[ name ].collections[ name ];

    log.silly( 'Create new ORM instance for model', name );

    // Create new instance
    let w = new Waterline();
    w.loadCollection( Waterline.Collection.extend( {
        identity: name,
        connection: 'default',
        schema: false
    } ) );
    w.initialize( config, ( err, orm ) => {

        if ( !err ) return;

        log.error( 'Model error', err );
        throw err;

    } );

    // Save and return newly created instance
    models[ name ] = w;
    return models[ name ].collections[ name ];

};
