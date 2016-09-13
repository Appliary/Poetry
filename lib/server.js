const Hapi = require( 'hapi' ),
    Log = require( './methods/log' ),
    os = require( 'os' ),
    pkg = require('../package.json');

const server = new Hapi.Server();
module.exports = server;

server.connection( {
    port: process.env.PORT || process.env.port || 8000
} );

let config = process.env.DATABASE_PORT || process.env.DATABASE || process.env.database;
if ( config ) config += '/database';
else config = 'mongodb://localhost:27017/database'

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.ext( {
    type: 'onPreAuth',
    method: require( './session/getSession' )
} );

server.ext( {
    type: 'onPostAuth',
    method: require( './session/role' )
} );

server.ext( {
    type: 'onPreResponse',
    method: require( './session/saveSession' )
} );

server.start( ( err ) => {

    if ( err ) throw err;
    Log.info( 'HAPI server listening on', server.info.uri );
    Log.verbose( server.info.id, server.info.started );

} );

server.state( 'session', {
    ttl: null,
    path: '/'
} );

server.route( {
    path: '/_healthCheck',
    method: '*',
    handler: ( req, res ) => {
        res( `I'm alive !

Host: ${os.hostname()}
Port: ${server.info.port}
Uptime: ${Date.now()-server.info.started}ms
IsAuth: ${!!req.session.isAuthenticated}
Poetry: ${pkg.version}
` )
            .type( 'text/plain' );
    }
} );
