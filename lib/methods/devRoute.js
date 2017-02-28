/**
 * Poetry.devRoute
 * Create a new route, not publicly accessible
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const server = require( '../server' ),
    log = require( './log' );

module.exports = function webroute(
    options,
    handler
) {

    if ( !options.method ) options.method = '*';
    if ( !options.path ) options.path = '/';
    if ( !options.config ) options.config = {};
    if ( !options.config.plugins ) options.config.plugins = {};

    if ( typeof options.auth == 'string' ) options.auth = [ options.auth ];
    options.config.plugins.poetryAuth = options.auth;
    delete options.auth;

    if ( options.config.cors === undefined || options.config.cors === true )
        options.config.cors = {
            credentials: true,
            origin: [ '*' ],
            headers: [ 'Accept', 'Authorization', 'Content-Type', 'If-None-Match' ]
        };

    log.info( '🛣  Registering route :', options.method, options.path );

    let route = options;
    route.handler = handler;
    server.route( route );

    return options;

};
