const getModel = require( './model.js' );

module.exports = function ( modelName, item, cb ) {

    return new Promise( ( resolve ) => {

        getModel( modelName )
            .then( ( model ) => {

                if ( typeof item.id == undefined )
                    return resolve( model.create( item, cb ) );

                return resolve( model.update( {
                    id: item.id
                }, item, cb ) );

            } );

    } );

};
