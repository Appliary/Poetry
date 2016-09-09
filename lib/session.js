const Log = require( './methods/log' ),
    Models = require( '../models' ),
    Sessions = Models.sessions,
    Users = Models.users,
    Teams = Models.teams;

module.exports = function sessionMiddleware( request, reply ) {

    // Session cookie not found
    if ( !request.state.session )
        return newSession();

    // Get the session from the DB
    Sessions.findOne( {
            _id: request.state.session
        } )
        .then( ( session ) => {

            if ( !session ) {
                newSession();
                request.session = {
                    _id: session._id
                };
                return reply.continue();
            }


            Log.silly( 'Active session', session._id.toString(), !!session.isAuthenticated );

            if ( !session.keep ) {

                let hourAgo = new Date();
                hourAgo = hourAgo.setHours( hourAgo.getHours - 1 );

                if ( session.updatedAt < hourAgo ) {
                    Log.silly( 'Dropped old session', session._id );
                    request.session = {
                        _id: session._id
                    };
                    return reply.continue();
                }

            }

            // Add the found session to request
            request.session = session;

            // Restart session timeout
            reply.state( 'session', session._id.toString() );

            Sessions.update( {
                    _id: session._id
                }, session );

            if ( !session.user )
                return reply.continue();

            // Populate user
            Users.findOne( {
                    _id: session.user
                } )
                .then( ( user ) => {
                    request.session.user = user;

                    if ( !user.team ) return reply.continue();

                    // Populate team
                    Teams.findOne( {
                            _id: user.team
                        } )
                        .then( ( team ) => {
                            request.session.team = team
                            return reply.continue();
                        }, ( err ) => {
                            Log.error( 'Cannot retrieve TEAM' );
                            return reply.continue();
                        } );
                }, ( err ) => {
                    Log.error( 'Cannot retrieve USER' );
                    return reply.continue();
                } );

        }, ( err ) => {
            Log.error( 'Cannot retrieve SESSION' );
            return reply.continue();
        } );

    function newSession( id ) {
        // Create a new ID
        return Sessions.insert( {
                _id: id || ( ( Math.random() * 0xFFFFFFFFFFFFFF )
                    .toString( 32 ) + ( Math.random() * 0xFFFFFFFFFFFFFF )
                    .toString( 32 ) )
            } )
            .then( ( session ) => {
                console.log( 'newsess', session );

                Log.silly( 'New session', session._id.toString() );
                reply.state( 'session', session._id.toString() );

                request.session = {};
                reply.continue();

            }, ( err ) => {
                Log.error( 'Cannot create session' );
                return reply.continue();
            } );
    }

}
