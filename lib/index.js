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
require('./checks'); // Check for Node version

const events = require('./methods/events'),
    endpoint = require( './methods/endpoint' );

module.exports = new Proxy( {

    //// Enpoint registration ////
    route: endpoint,
    endpoint: endpoint,

    // Session
    session: require('./methods/session'),

    //// ORM ////
    model: require( './methods/model' ),
    db: require( './findDB' ),

    //// Logging ////
    log: require( './methods/log' ),

    //// Event messaging ////
    emit: events.emit,
    on: events.on,

    inspect: require('./methods/inspect')

}, {

    get( target, property ) {

        // Return target if exists
        if ( target[ property ] )
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

module.exports.log.info( 'Poetry loaded' );
