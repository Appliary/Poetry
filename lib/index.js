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
    save: require( './methods/save' ),
    // find: require( './methods/find' ),
    // findOne: require( './methods/findOne' ),
    // update: require( './methods/find' ),
    // delete: require( './methods/delete' ),

    //// Event-based communication ////
    // emit: require( './methods/emit' ),
    // on: require( './methods/on' )

}, {

    get( target, property ){
        //TODO: Handle onXXX generic methods
        throw new Error(`Poetry does not export "${property}".`);
    },

    // Avoid lib replacement
    set(){}

} );
