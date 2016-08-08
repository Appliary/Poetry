const winston = require( 'winston' );

var logger = new winston.Logger( {
    level: 'silly',
    transports: [
        new( winston.transports.Console )( {
            timestamp: true,
            showLevel: true,
            colorize: true
        } ),
        new( winston.transports.File )( {
            filename: 'poetry.log'
        } )
    ]
} );

module.exports = logger.verbose;
module.exports.silly = logger.silly;
module.exports.debug = logger.debug;
module.exports.verbose = logger.verbose;
module.exports.info = logger.info;
module.exports.warn = logger.warn;
module.exports.error = logger.error;
