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

    if ( !opt.method ) opt.method = '*';
    if ( !opt.path ) opt.path = '/';
    if ( !opt.config ) opt.config = {};
    if ( !opt.config.plugins ) opt.config.plugins = {};

    if ( opt.config.validate ){
        if ( !opt.config.validate.options )
            opt.config.validate.options = {};
        if ( opt.config.validate.options.stripUnknown === undefined )
            opt.config.validate.options.stripUnknown = true;
        registerJoiRoute( opt );
    }

    let options = devRoute(opt, handler);
    options.poetryPort = server.info.port;

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
