const Schema = require( 'jugglingdb' )
    .Schema,
    Log = require( './methods/log' );

var conf = process.env.DATABASE_PORT || process.env.DATABASE;

try {
    if ( !conf ) throw '';
    module.exports = new Schema( 'mongodb', {
        url: conf + '/database',
        debug: true
    } );
    Log.verbose( 'Using MongoDB', conf, '/database' );
} catch ( err ) {
    try {
        if ( !conf ) throw '';
        module.exports = new Schema( 'mongodb', {
            url: conf,
            debug: true
        } );
        Log.verbose( 'Using MongoDB', conf );
    } catch ( err ) {
        try {
            module.exports = new Schema( 'mongodb', {
                url: 'tcp://localhost:27017/database',
                debug: true
            } );
            Log.verbose( 'Using MongoDB localhost' );
        } catch ( err ) {
            module.exports = new Schema( 'memory', {
                debug: true
            } );
            Log.warn( 'Using in-memory DB' );
        }
    }
}
