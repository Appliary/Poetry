const Hapi = require( 'hapi' ),
    Log = require( './methods/log' ),
    os = require( 'os' );

const port = process.env.PPORT || process.env.pport || 8000;

const server = new Hapi.Server();
server.connection( {
    port: port
} );

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.start( ( err ) => {

    if ( err ) throw err;
    Log.info( 'HAPI server listening on', server.info.uri + '\n');
    Log.verbose( server.info );

} );

module.exports = server;


server.route( {
    path: '/_healthCheck',
    method: '*',
    handler: ( req, res ) => {
        res( "I'm alive @ " + os.hostname() );
    }
} );
