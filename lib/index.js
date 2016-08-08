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
    // find: require( './methods/find' ),
    // findOne: require( './methods/findOne' ),
    save: require( './methods/save' ),
    // update: require( './methods/find' ),
    // destroy: require( './methods/destroy' ),
    // delete: require( './methods/delete' ),

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
