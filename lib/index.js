/**
 * Poetry library
 * Facade to the lib exports
 * @name Poetry
 * @exports route
 * @exports endpoint
 * @exports session
 * @exports model
 * @exports db
 * @exports log
 * @exports emit
 * @exports on
 */

'use strict';
require( './checks' ); // Check for Node version

const events = require( './methods/events' ),
    pkg = require( '../package.json' );

module.exports = new Proxy( {

    //// Enpoint registration ////
    route: require( './methods/route' ),
    devRoute: require( './methods/devRoute' ),
    hapiServer: require( './server' ),

    //// Logging ////
    log: require( './methods/log' ),

    //// Event messaging ////
    emit: events.emit,
    on: events.on,

    inspect: require( './methods/inspect' ),
    login: require( './methods/login' )

}, {

    get( target, property ) {

        // Return target if exists
        if ( target[ property ] !== undefined )
            return target[ property ];

        // Compatibility with Babel __esModule, etc
        if ( property.slice( 0, 2 ) == '__' )
            return undefined;

        //TODO: Handle onXXX generic methods
        throw new Error( `Poetry does not export "${property}".` );
    },

    // Avoid lib replacement
    set() {}

} );
// Session handlers
module.exports.hapiServer.ext( [ {
    type: 'onPostAuth',
    method: require( './session/role' )
}, {
    type: 'onPreResponse',
    method: require( './session/saveSession' )
} ] );

module.exports.log.info( `Poetry ${pkg.version} loaded` );
