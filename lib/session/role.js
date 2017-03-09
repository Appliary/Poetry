const Boom = require( 'boom' ),
    Log = require( '../methods/log.js' ),
    DB = require( '../../models.js' );

const ObjectID = DB.ObjectID,
    UserGroups = DB.UserGroups;

module.exports = function checkRole( request, reply ) {

    let auth = request.route.settings.plugins.poetryAuth;

    process.nextTick( () => {

        // Avoid unknown property issue
        request.session.role = {};

        // No auth check needed
        if ( !auth )
            return reply.continue();

        // Not logged on
        if ( !request.session.isAuthenticated || !request.session.user )
            return reply( Boom.unauthorized() );

        // SUPER case
        if ( request.session.user.role == 'SUPER' )
            return reply.continue();

        // ADMIN case
        if ( request.session.user.role == '*' )
            return roles( {
                name: "ADMIN",
                permissions: request.session.team.permissions
            } );

        // USER case
        let id;
        try {
            id = ObjectID( request.session.user.role );
        } catch ( err ) {
            Log.error( 'Wrong role for ', JSON.stringify( request.session.user ) );
            return reply( Boom.forbidden() );
        }
        UserGroups.findOne( {
                _id: id,
                team: request.session.team._id
            } )
            .then( roles, roles );

    } );

    function roles( role ) {

        if ( !role ) {
            Log.warn( 'Unknown role !', request.route.method, request.route.path );
            return reply( Boom.forbidden() );
        }

        request.session.role = role;

        // Special handwritten auths
        if ( Array.isArray( auth ) ) {
            if ( auth.some( tag => check(
                    `API.${tag}.${ request.route.settings.description }`,
                    role
                ) ) ) return Log.silly( 'Custom role found' );
        }

        if ( request.route.settings.tags ) {

            // For descripted routes
            if ( request.route.settings.description ) {

                // Check for each tag
                if ( request.route.settings.tags.some( tag => check(
                        `API.${tag}.${ request.route.settings.description }`,
                        role.permissions
                    ) ) ) return Log.silly( 'Precise role found' );

            }

            // For tagged routes
            if ( request.route.settings.tags.some( tag => check(
                    `API.${tag}`,
                    role.permissions
                ) ) ) return Log.silly( 'Tagged role found' );

        }

        // FORBIDDEN
        Log.silly( 'No permission found', request.route.method, request.route.path );
        return reply( Boom.forbidden( 'No permission found' ) );

    }

    // Get nested value with dot notation
    function check( path, object ) {

        // Separate string
        path = path.split( '.' );

        // Catch undefined
        if ( !object ) return false;
        if ( !object[ path[ 0 ] ] ) return false;

        // It's the targeted value
        if ( path.length == 1 ) {

            // If it's true, continue
            if ( object[ path[ 0 ] ] === true )
                reply.continue();

            // If it's false, block user
            else if ( object[ path[ 0 ] ] === false )
                reply( Boom.forbidden() );

            // If it's a boolean value, stop seeking.
            if ( object[ path[ 0 ] ] === true || object[ path[ 0 ] ] === false )
                return true;

            // Continues deeper
            return false;

        }

        // Deep inspect sub object
        return check( path.slice( 1 )
            .join( '.' ), object[ path[ 0 ] ] );

    }

};
