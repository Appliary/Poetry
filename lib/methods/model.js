const Models = require( '../models' );

module.exports = ( name, extension ) => {

    let model = Models[ name ];

    Object.keys( extension )
        .forEach( ( key ) => {
            let r = model.defineProperty( key, extension[ key ] );
        } );
};
