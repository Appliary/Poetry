const winston = require( 'winston' );

module.exports = new Proxy( new winston.Logger( {
    level: 'verbose',
    transports: [
        new( winston.transports.Console )(),
        new( winston.transports.File )( {
            filename: 'poetry.log'
        } )
    ]
} ), {
    apply( target, thisArg, options ) {
        target.log.apply( thisArg, options );
    }
} );
