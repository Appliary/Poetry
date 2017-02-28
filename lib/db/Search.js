/**
 * Search
 * Easy way to build a match query to search text in some fields
 *
 * @param {String} needle The thing we search
 * @param {String[]} fields Array of fields we search in
 */
module.exports = function Search( needle, fileds ) {

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

    // Return the whichcraft
    return {
        $or: query
    };

};
