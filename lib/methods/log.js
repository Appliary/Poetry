const windton = require( 'winston' );

module.exports = new winston.Logger( {
    level: 'verbose',
    transports: [
        new( winston.transports.Console )(),
        new( winston.transports.File )( {
            filename: 'poetry.log'
        } )
    ]
} );
