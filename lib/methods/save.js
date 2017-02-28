const getModel = require( './model.js' );

module.exports = function ( modelName, item, cb ) {

    if ( cb === undefined ) cb = () => {};

    return new Promise( resolve =>
        getModel( modelName )
        .then( ( model, b ) => {

            if ( !item.id && item.id !== 0 )
                return resolve( model.create( item, cb ) );

            model.findOrCreate( {
                id: item.id
            }, () => {

                resolve( model.update( {
                    id: item.id
                }, item, cb ) );

            } );
        } )
    );

};
