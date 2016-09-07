const DB = require( './models' ),
    Model = require( './methods/model' ),
    Log = require( './methods/log' );

Model( 'sessions', {
    isAuthenticated: {type:'boolean'}
} );

module.exports = function sessionMiddleware( request, reply ) {

    // Session cookie not found
    if ( !request.state.session ) {

        // Create a new ID
        return DB.sessions.create( {}, ( err, session ) => {

            Log.silly( 'New session', session.id.toString() );
            reply.state( 'session', session.id.toString() );

            request.session = {};
            reply.continue();

        } );

    }

    // Get the session from the DB
    DB.sessions.find( request.state.session,
        ( err, session ) => {

            // Session not found
            if ( err || !session ){
                request.session = {};
                return reply.continue();
            }

            // Add the found session to request
            request.session = session;

            // Restart session timeout
            reply.state( 'session', session.id.toString() );
            session.save();

            return reply.continue();

        } );
}
