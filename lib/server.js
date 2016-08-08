const Hapi = require( 'hapi' );
const Log = require( './methods/log' );

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
    Log( 'HAPI server listening on', server.info.uri + '\n', server.info );

} );

module.exports = server;
