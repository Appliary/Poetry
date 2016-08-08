const Hapi = require( 'hapi' );
const Poetry = require( './' );

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
    Poetry.log( 'HAPI server running at:', server.info.uri );

} );

module.exports = server;
