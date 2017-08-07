const Hapi = require( 'hapi' ),
    Log = require( './methods/log' ),
    os = require( 'os' ),
    pkg = require( '../package.json' ),
    db = require( '../models.js' );

const server = new Hapi.Server();
module.exports = server;

let opts = {
    port: process.env.PORT || process.env.port || 8000
};

if ( process.env.ssl_key && process.env.ssl_crt )
    opts.ssl = {
        key: process.env.ssl_key,
        cert: process.env.ssl_crt
    };

if ( process.env.SSL_KEY && process.env.SSL_CRT )
    opts.ssl = {
        key: process.env.SSL_KEY,
        cert: process.env.SSL_CRT
    };

server.connection( opts );

server.register( require( 'inert' ), ( err ) => {
    if ( err ) throw err;
} );

server.ext( {
    type: 'onPreAuth',
    method: require( './session/getSession' )
} );

server.start( err => {

    if ( err ) throw err;
    Log.info( '📢  HAPI server listening on', server.info.uri );
    Log.verbose( server.info.id, server.info.started );

} );

server.state( 'session', {
    ttl: null,
    path: '/',
    isSecure: false
} );

server.route( {
    path: '/_healthCheck',
    method: '*',
    config: {
        description: 'Health check'
    },
    handler: function ( req, reply ) {
        db.Users.findOne( {} )
            .then( () => {
                reply( `I'm alive !

    Host: ${os.hostname()}
    Port: ${server.info.port}
    Uptime: ${Date.now()-server.info.started}ms
    IsAuth: ${!!req.session.isAuthenticated}
    Poetry: ${pkg.version}
    ` )
                    .type( 'text/plain' );
            }, reply );
    }
} );
