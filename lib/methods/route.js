/**
 * Poetry.route
 * Create a new endpoint
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const log = require( './log' ),
    events = require( './events' ),
    devRoute = require('./devRoute');

let registry = [];

module.exports = function route(
    opt,
    handler
) {

    let options = devRoute(opt, handler);

    events.emit( 'web:route', options );
    registry.push( options );

};

events.on( 'web:init', ( message ) => {
    registry.forEach( ( options ) => {
        events.emit( 'web:route', options );
    } );
} );
