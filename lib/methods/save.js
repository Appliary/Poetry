const getModel = require( './model.js' );

module.exports = function ( modelName, item, cb ) {
    let model = getModel( modelName );

    if ( typeof item.id == undefined )
        return model.create( item, cb );

    return model.update( {
        id: item.id
    }, item, cb );
};
