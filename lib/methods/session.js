const server = require( '../server' ),
    log = require( './log' ),
    events = require( './events' );

if ( process.env.DATABASE_PORT && process.env.DATABASE_PORT.indexOf( '27017' ) ){

    server.register( {
        plugin: require( 'hapi-session-mongo' ),
        options: {
            db: 'database',
            ip: process.env.DATABASE_PORT
        }
    }, function ( err ) {

        if ( err ) throw log.error( err );

        server.auth.strategy( 'session', 'mongo', {

            validateFunc: function ( session, cb ) {
                server.plugins[ 'hapi-session-mongo' ].user.get( session, cb );
            }

        } );

    } );

    module.exports = server.plugins[ 'hapi-session-mongo' ].user;

}else{

    log.warn('Session stored in memory !');

    module.exports = {

    }
}
