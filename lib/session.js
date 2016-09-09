const Log = require( './methods/log' ),
    Models = require( '../models' ),
    Sessions = Models.sessions;

module.exports = function sessionMiddleware( request, reply ) {

    // Session cookie not found
    if ( !request.state.session ) return newSession();

    // Get the session from the DB
    Sessions.findOne( {
            _id: request.state.session
        } )
        .then( ( session ) => {

            if ( !session  ){
                return newSession();
            };

            if ( !session.keep ) {
                let hourAgo = new Date();
                hourAgo = hourAgo.setHours( hourAgo.getHours - 1 );
                if ( session.updatedAt < hourAgo ) {
                    Log.silly( 'Dropped old session', session.id.toString() );
                    request.session = {
                        id: session.id
                    };
                    return reply.continue();
                }
            }

            // Add the found session to request
            request.session = session;

            // Restart session timeout
            if ( session.keep ) {
                reply.state( 'session', session.id.toString() );
            }

            return reply.continue();

        } );

    function newSession(){
        // Create a new ID
        return Sessions.insert({
            _id: (Math.random() * 0xFFFFFFFFFFFFFF).toString(32) + (Math.random() * 0xFFFFFFFFFFFFFF).toString(32)
        })
            .then( ( session ) => {

                Log.silly( 'New session', session._id.toString() );
                reply.state( 'session', session._id.toString() );

                request.session = {};
                reply.continue();

            }, ( err ) => {
                console.log( err );
            } );
    }

}
