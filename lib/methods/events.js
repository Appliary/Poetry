const patrun = require( 'patrun' ),
    log = require( './log' );

var EventEmitter;

var lastReceived = [];

try {
    EventEmitter = require( 'multicast-events' )
        .EventEmitter;
} catch ( err ) {
    module.exports.on = () => {};
    module.exports.emit = () => {};
    return log.warn( 'Multicast-events not found: no microservice message will be received/sent' );
}

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

        log.verbose( '📣  Now listening event :', eventName );
        registry[ eventName ] = patrun( {
            gex: true
        } );

        emitter.on( eventName, ( message, rinfo ) => {

            if ( message.__eventId ) {
                if ( ~lastReceived.indexOf( message.__eventId ) )
                    return;
                lastReceived.push( message.__eventId );
                if ( lastReceived.length >= 50 )
                    lastReceived.shift();
                delete message.__eventId;
            }

            let rcb = registry[ eventName ].find( message );
            if ( !rcb )
                return log.silly( '🗑  Event dropped :', eventName, message );

            log.verbose( '📥  Event from', rinfo.address, ':', eventName );
            return rcb( message, rinfo );

        } );

    }

    log.silly( 'Pattern filter added for', eventName, pattern );
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

    if ( typeof message == 'undefined' )
        message = {};

    message.__eventId = ( Date.now() + Math.random() )
        .toString( 32 );

    emitter.emit( eventName, message );
    log.verbose( '📤  Event emited :', eventName );

};
