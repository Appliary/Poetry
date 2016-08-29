/**
 * Poetry.endpoint
 * Create a new endpoint
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const server = require( '../server' ),
    log = require( './log' ),
    events = require( './events' );

let registry = [];

module.exports = function endpoint(
    options,
    handler
) {

    if ( !options.method ) options.method = '*';
    if ( !options.path ) options.path = '/';
    if ( ! options.config ) options.config = {};

    if ( options.auth === true ){
        options.config.auth = 'session';
        delete options.auth;
    }else if( options.auth ){
        options.config.auth: options.auth;
        delete options.auth;
    }

    log.info( 'Registering route :', options.method, options.path );

    let route = options;
    route.handler = handler;
    server.route( route );

    events.emit( 'web:route', options );
    registry.push( options );

};

events.on( 'web:init', ( message ) => {
    registry.forEach( ( options ) => {
        events.emit( 'web:route', options );
    } );
} );
