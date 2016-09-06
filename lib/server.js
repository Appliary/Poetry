const Hapi = require( 'hapi' ),
    Log = require( './methods/log' ),
    os = require( 'os' );

const server = new Hapi.Server();
module.exports = server;

server.connection( {
    port: process.env.PORT || process.env.port || 8000
} );

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.ext({
    type: 'onPreAuth',
    method: require('./session')
});

server.start( ( err ) => {

    if ( err ) throw err;
    Log.info( 'HAPI server listening on', server.info.uri );
    Log.verbose( server.info.id );

} );

server.state('session', {
    ttl: 24 * 60 * 60 * 1000,
    path: '/'
});

server.route( {
    path: '/_healthCheck',
    method: '*',
    handler: ( req, res ) => {
        res( `I'm alive !
    Host: ${os.hostname()}
    Port: ${server.info.port}
    Uptime: ${Date.now()-server.info.started}ms
    IsAuth: ${!!req.session.isAuthenticated}` )
            .type( 'text/plain' );
    }
} );
