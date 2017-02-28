const Log = require( '../methods/log' ),
    AggrMehtods = require( './AggrMehtods' );

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
    AggrMehtods.forEach( verb => {
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
        return modelORM.aggregate.apply( null, aggregation )
            .then( success, failed );

    };

    // Return the aggregation array/builder
    return aggregation;

};
