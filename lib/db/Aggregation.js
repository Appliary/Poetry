const Log = require( '../methods/log' ),
    Search = require( './Search' ),
    AggrMethods = require( './AggrMethods' );

/**
 * Aggregation
 * Sugar aggregation builder, through chained methods.
 * @param {Model} modelORM Promised-mongo collection object
 * @return {Promise}
 */
module.exports = function Aggregation( modelORM ) {

    // Create an array
    let aggregation = [];

    // Link methods
    AggrMethods.forEach( verb => {
        aggregation[ verb ] = wraper( verb );
    } );

    // Wrap into a verb
    function wraper( verb ) {
        return ( param ) => {

            // Wrap in the $verb
            let step = {};
            step[ '$' + verb ] = param;

            // Add to aggregation and chain
            aggregation.push( step );
            return aggregation;

        };
    }

    // Execute aggregation when CB is set
    aggregation.then = function ( success, failed ) {

        if ( !modelORM.aggregate )
            return Log.error( 'Aggregation not available on', modelORM );

        // Pass the pipeline, the Callbacks and return the Promise
        return modelORM.aggregate.apply( modelORM, aggregation )
            .then( success, failed );

    };

    // Add a search sugar builder
    aggregation.search = function ( needle, fields ) {
        return aggregation.match( Search( needle, fields ) );
    };

    // Return the aggregation array/builder
    return aggregation;

};
