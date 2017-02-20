const Login = require( '../methods/login' ),
    Log = require( '../methods/log' );

module.exports = function basicAuth( request, reply ) {

    let token = request.headers.authorization.split( ' ', 2 )[ 1 ];
    token = new Buffer( token, 'base64' );
    token = token.toString()
        .split( ':', 2 );

    let user = token[ 0 ];
    let pass = token[ 1 ];

    Log.silly( 'BasicAuth', user );

    return Login( user, pass );

};
