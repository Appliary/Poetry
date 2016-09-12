const Log = require( '../methods/log' ),
    Models = require( '../../models' ),
    BasicAuth = require( './basicAuth' ),
    Sessions = Models.sessions,
    Users = Models.users,
    Teams = Models.teams;

module.exports = function sessionMiddleware( request, reply ) {

    if ( request.headers.authorization ) {

        // Basic HTTP auth
        if ( request.headers.authorization.indexOf( 'Basic' ) === 0 )
            return BasicAuth( request ).then(sessionRetrieved);

    }

    // Get the session from the DB
    Sessions.findOne( {
            _id: request.state.session
        } )
        .then( sessionRetrieved )
        .catch( error( 'Cannot retrieve SESSION' ) );


    /**
     * sessionRetrieved
     * Connect potential user through given session
     *
     * @param {object} session Session retrieved
     */
    function sessionRetrieved( session ) {

        // No session
        if ( !session ) {
            request.session = {
                _id: request.state.session
            };
            return reply.continue();
        }

        Log.silly( 'Active session', session._id, !!session.isAuthenticated, session.user );

        // Clean old unkeeped sessions
        if ( !session.keep ) session = checkAge( session );

        // Add the found session to request
        request.session = session;

        // If there's no user, delegate
        if ( !session.user || typeof session.user == 'object' )
            return reply.continue();

        // Populate user
        Users.findOne( {
                _id: session.user
            } )
            .then( populateUser )
            .catch( error( 'Cannot retrieve user' ) );

    }

    function populateUser( user ) {

        // Store populated user in request.session
        request.session.user = user;

        // If there's no team, delegate
        if ( !user.team ) return reply.continue();

        // Populate team
        Teams.findOne( {
                _id: user.team
            } )
            .then( ( team ) => {
                request.session.team = team
                return reply.continue();
            })
            .catch( error( 'Cannot retrieve TEAM' ) );

    }

    function checkAge( session ) {

        let hourAgo = new Date();
        hourAgo = hourAgo.setHours( hourAgo.getHours - 1 );

        if ( session.updatedAt < hourAgo ) {

            Log.silly( 'Dropped old session', session._id );
            session = {
                _id: session._id
            };

            Sessions.remove( {
                _id: session._id
            } );

        }

        return session;

    }

    function error( message ) {

        return ( err ) => {
            Log.error( message, err );

            request.session = {};
            return reply.continue();
        }

    }

}
