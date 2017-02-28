const getModel = require( './model.js' );

module.exports = function ( modelName, query, cb ) {

    // DummyCB
    if ( cb === undefined ) cb = () => {};

    return new Promise( resolve =>
        getModel( modelName )
        .then( ( model, b ) =>
            resolve( model.find( query, cb ) )
        )
    );

};
