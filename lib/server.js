const Hapi = require( 'hapi' ),
    Log = require( './methods/log' ),
    os = require( 'os' );

const server = new Hapi.Server();
module.exports = server;

const port = Math.floor(Math.random() * 1999) + 8000;
server.connection( {
    port: process.env.PORT || process.env.port || port
} );

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.start( ( err ) => {

    if ( err ) throw err;
    Log.info( 'HAPI server listening on', server.info.uri );
    Log.verbose( server.info.id );

} );


server.route( {
    path: '/_healthCheck',
    method: '*',
    handler: ( req, res ) => {
        res( "I'm alive @ " + os.hostname() );
    }
} );
