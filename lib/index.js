/**
 * Poetry library
 * Facade to the lib exports
 * @name Poetry
 * @exports
 */

module.exports = new Proxy( {

    //// Enpoint registration ////
    route: require( './methods/endpoint' ),
    endpoint: require( './methods/endpoint' ),

    //// Waterline ORM ////
    model: require( './methods/model'),
    save: require( './methods/save' ),

    //// Event-based communication ////
    // emit: require( './methods/emit' ),
    // on: require( './methods/on' ),

    //// Logging ////
    log: require('./methods/log')

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

module.exports.log.info('Poetry loaded');
