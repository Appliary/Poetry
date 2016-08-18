const EventEmitter = require( 'multicast-events' )
    .EventEmitter,
    patrun = require( 'patrun' ),
    log = require( './log' );

var emitter = new EventEmitter( {
        name: process.pid,
        id: 'poetry',
        loopback: true
    } ),
    registry = {};

/**
 * Poetry.on
 * Create an event listener
 * @param {string} eventName Name of the event
 * @param {object} pattern Pattern used to filter events with Patrun
 * @param {function} cb Callback fired everytimes an event corresponds
 * @returns {void} void
 */
module.exports.on = function on( eventName, pattern, cb ) {

    eventName = eventName.toLowerCase();

    if ( !registry[ eventName ] ) {

        log.verbose( 'Now listening :', eventName );
        registry[ eventName ] = patrun();

        emitter.on( eventName, ( message, rinfo ) => {

            let rcb = registry[ eventName ].find( message );
            if ( !rcb )
                return log.silly( 'Event dropped :', eventName );

            log.verbose( 'Event received :', eventName, rinfo );
            return rcb( message, rinfo );

        } );

    }

    log.verbose( 'Pattern filter added for', eventName );
    registry[ eventName ].add( pattern, cb );

};

/**
 * Poetry.emit
 * Emit an event
 * @param {string} eventName Name of the event
 * @param {object} message Content of the message
 * @returns {void} void
 */
module.exports.emit = function emit( eventName, message ) {

    eventName = eventName.toLowerCase();

    emitter.emit( eventName, message );
    log.verbose( 'Event emited :', eventName );

};
