/**
 * Poetry.endpoint
 * Create a new endpoint
 * @param {object} options Options passed to HAPI server
 * @param {function} handler Request handler passed to HAPI server
 * @returns {void} void
 */
const server = require( '../server' );

module.exports = function endpoint(
    options,
    handler
) {

    let route = options;
    route.handler = handler;
    server.route( route );

};
