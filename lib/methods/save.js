const getModel = require( './model.js' );

module.exports = function ( modelName, item, cb ) {

    return new Promise( ( resolve ) => {

        getModel( modelName )
            .then( ( model, b ) => {

                console.log( 'toto', model, b );

                if ( typeof item.id == undefined )
                    return resolve( model.create( item, cb ) );

                model.findOrCreate( {
                    id: item.id
                }, () => {

                    resolve( model.update( {
                        id: item.id
                    }, item, cb ) );

                } );
            } );

    } );

};
