const Login = require( '../methods/login' ),
    Log = require( '../methods/log' );

module.exports = function basicAuth( request, reply ) {

    let token = request.headers.authorization.split( ' ', 2 )[ 1 ];
    token = new Buffer( token, 'base64' );
    token = token.toString()
        .split( ':', 2 );

    let user = token[ 0 ];
    let pass = token[ 1 ];

    Log.silly( '🔑  BasicAuth', user );

    let checkMobileToken = request.headers[ "User-Agent" ] && ~request.headers[ "User-Agent" ].indexOf( "Mobi" );

    return Login( user, pass, checkMobileToken );

};
