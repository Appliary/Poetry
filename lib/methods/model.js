const Waterline = require( 'waterline' );

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

    // Create new instance
    let w = new Waterline();
    w.loadCollection( Waterline.Collection.extend( {
        identity: name,
        connection: 'default',
        schema: false
    } ) );
    w.initialize( config, ( err, orm ) => {

        if ( err ) throw err;

    } );

    // Save and return newly created instance
    models[ name ] = w;
    return models[ name ].collections[ name ];

};
