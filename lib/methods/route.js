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
    devRoute = require( './devRoute' );

// Local routes registry to send all on 'web:init'
let registry = [];

module.exports = function route(
    opt,
    handler
) {

    // Set defaults
    if ( !opt.method ) opt.method = '*';
    if ( !opt.path ) opt.path = '/';
    if ( !opt.config ) opt.config = {};
    if ( !opt.config.plugins ) opt.config.plugins = {};

    // Change validation
    if ( opt.config.validate ) {
        if ( !opt.config.validate.options )
            opt.config.validate.options = {};
        if ( opt.config.validate.options.stripUnknown === undefined )
            opt.config.validate.options.stripUnknown = true;

        // Add a route to get the Joi validation object
        registerJoiRoute( opt );
    }

    // Register the internal HAPI route to the router, and retrieve the options
    let options = devRoute( opt, handler );
    options.poetryPort = server.info.port;

    // Register the route to the other services,
    // and add it to the local registry
    events.emit( 'web:route', options );
    registry.push( options );

};

// Listen for a 'web:init' event to register all the local routes from the
// registry to the new API Gateway
events.on( 'web:init', {}, message => {

    // Loop into the registry
    registry.forEach( options => events.emit( 'web:route', options ) );

} );

/**
 * registerJoiRoute
 * Add a route to retrieve the Joi validation object
 *
 * @param {Object} route Configuration of the route
 */
function registerJoiRoute( route ) {

    // Add a / at the start of the route if missing
    if ( route.path.indexOf( '/' ) !== 0 )
        route.path = `/${route.path}`;

    // Register the tiny controller ;-)
    let handler = ( r, res ) => res( route.config.validate );

    // Define the method and path of the validation route
    let options = {
        path: '/__joi' + route.path, // Let's add a __joi directory
        method: route.method
    };

    // Register the route into the local router
    devRoute( options, handler );

    // Save into the local registry
    options.handler = handler;
    registry.push( options );

    // Spread the good news to all the services
    events.emit( 'web:route', options );

}
