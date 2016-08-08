const Hapi = require( 'hapi' );
const Log = require( './methods/log' );

const port = process.env.PORT || process.env.port || 8080;

const server = new Hapi.Server();
server.connection( {
    port: port
} );

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.start( ( err ) => {

    if ( err ) throw err;
    Log( 'HAPI server started', server.info );

} );

module.exports = server;
