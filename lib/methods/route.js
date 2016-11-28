/**
 * Poetry.route
 * Create a new endpoint
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const log = require( './log' ),
    events = require( './events' ),
    server = require( '../server' ),
    devRoute = require('./devRoute');

let registry = [];

module.exports = function route(
    opt,
    handler
) {

    let options = devRoute(opt, handler);
    options.poetryPort = server.info.port;

    if ( options.config.validate ){
        if ( !options.config.validate.options )
            options.config.validate.options = {};
        if ( options.config.validate.options.stripUnknown === undefined )
            options.config.validate.options.stripUnknown = true;
        registerJoiRoute( options );
    }

    events.emit( 'web:route', options );
    setTimeout( ()=>{ // Second register in ±15s
        events.emit( 'web:route', options );
    }, 1000 + Math.random() * 15000 );
    registry.push( options );

};

events.on( 'web:init', {}, ( message ) => {
    registry.forEach( ( options ) => {
        events.emit( 'web:route', options );
        setTimeout( ()=>{ // Second register in ±15s
            events.emit( 'web:route', options );
        }, 1000 + Math.random() * 15000 );
    } );
} );

function registerJoiRoute( route ) {

    if ( route.path.indexOf('/') !== 0 )
        route.path = `/${route.path}`;

    let handler = ( r, res ) => res( route.config.validate );

    let options = {
        path: '/__joi' + route.path,
        method: route.method
    };

    devRoute( options, handler );

    options.handler = handler;
    registry.push( options );

    events.emit( 'web:route', options );
    setTimeout( ()=>{ // Second register in ±15s
        events.emit( 'web:route', options );
    }, 1000 + Math.random() * 15000 );

}
