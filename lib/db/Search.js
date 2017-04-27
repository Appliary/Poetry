/**
 * Search
 * Easy way to build a match query to search text in some fields
 *
 * @param {String} needle The thing we search
 * @param {String[]} fields Array of fields we search in
 */
const ObjectID = require( '../../models' )
    .ObjectId;

module.exports = function Search( needle, fields ) {

    // Do magic
    let query = [];
    needle = needle.replace( /[.?*+^$[\]\\(){}|-]/g, "\\$&" );
    fields.forEach( field => {
        let cond = {};
        cond[ field ] = {
            $regex: `.*${needle}.*`,
            $options: 'is'
        };
        query.push( cond );
    } );

    // Handle ObjectID case
    if ( needle.length == 24 )
        try {
            query.unshift( {
                _id: ObjectID( needle )
            } );
        } catch ( e ) {}

    // Return the whichcraft
    return {
        $or: query
    };

};
