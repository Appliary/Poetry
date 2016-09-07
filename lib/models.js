const Database = require( './findDB' ),
    Log = require( './methods/log.js' ),
    Event = require( './methods/events.js' );

Database.on( 'log', Log.silly );

module.exports = new Proxy( {}, {

    get( t, property ) {

        if ( typeof property != 'string' || property == 'inspect' || property == 'valueOf' )
            return undefined;

        property = property.toLowerCase();
        if( property.charAt(property.length-1) != 's' )
            property += 's';

        if ( !Database.models[ property ] ) {
            Database.define( property, {
                createdAt: Date,
                updatedAt: Date
            }, {
                onlySchema: false
            } );
            let model = Database.models[ property ];
            model.belongsTo( 'user', {
                as: 'createdBy',
                foreignKey: 'createdBy'
            } );
            model.belongsTo( 'user', {
                as: 'updatedBy',
                foreignKey: 'updatedBy'
            } );
            model.beforeCreate = ( next, data ) => {
                data.createdAt = new Date();
                next();
            };
            model.beforeUpdate = ( next, data ) => {
                data.updatedAt = new Date();
                next();
            };
            model.afterSave = ( next ) => {
                Event.emit( 'save:' + property, this );
                next();
            };
            model.afterUpdate = ( next ) => {
                Event.emit( 'update:' + property, this );
                next();
            };
            model.afterCreate = ( next ) => {
                Event.emit( 'create:' + property, this );
                next();
            };
        }

        return Database.models[ property ];

    },

    set( t, property, definition ) {
        return Database.define( property, definition );
    }

} );
