/**
 * Poetry library
 * Facade to the lib exports
 * @name Poetry
 * @exports
 */

const events = require('./methods/events');

module.exports = new Proxy( {

    //// Enpoint registration ////
    route: require( './methods/endpoint' ),
    endpoint: require( './methods/endpoint' ),

    //// Waterline ORM ////
    model: require( './methods/model' ),
    save: require( './methods/save' ),

    //// Logging ////
    log: require( './methods/log' ),

    //// Event messaging ////
    emit: events.emit,
    on: events.on,

    //// Service registry ////
    // register: require( './methods/register' ),
    // registered: require( './methods/registered' ),
    // leave: require('./methods/leave'),
    // leaved: require( './methods/leaved' ),

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
