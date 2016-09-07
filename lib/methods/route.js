/**
 * Poetry.route
 * Create a new endpoint
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const log = require( './log' ),
    events = require( './events' ),
    server = require( '../server' ),
    devRoute = require('./devRoute');

let registry = [];

module.exports = function route(
    opt,
    handler
) {

    let options = devRoute(opt, handler);
    options.poetryPort = server.info.port

    if( options.config.validate && options.config.validate.payload ){
        // if(!options.config.plugins)
        //     options.config.plugins = {};
        // if(!options.config.plugins['hapi-swaggered'])
        //     options.config.plugins['hapi-swaggered'] = {};
        // if(!options.config.plugins['hapi-swaggered'].validate)
        //     options.config.plugins['hapi-swaggered'].validate = {};
        //
        // options.config.plugins['hapi-swaggered'].validate.payload = options.config.validate.payload;

        options.config.validate.payload = undefined;
    }

    events.emit( 'web:route', options );
    registry.push( options );

};

events.on( 'web:init', {}, ( message ) => {
    registry.forEach( ( options ) => {
        events.emit( 'web:route', options );
    } );
} );
