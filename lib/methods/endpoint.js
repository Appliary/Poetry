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

module.exports = function endpoint(
    options,
    handler
) {

    if ( !options.method ) options.method = '*';

    log.info( 'Registering route :', options.method, options.path || '/' );

    let route = options;
    route.handler = handler;
    server.route( route );

    events.emit( 'hapi:route', options );

};
