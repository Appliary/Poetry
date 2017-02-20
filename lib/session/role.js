const Boom = require( 'boom' ),
    Log = require( '../methods/log.js' ),
    Roles = require( '../../models.js' )
    .Roles;

module.exports = function checkRole( request, reply ) {

    let auth = request.route.settings.plugins.poetryAuth;

    process.nextTick( () => {

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
            Log.error( 'Wrong role for ', request.session.user );
            return reply( Boom.forbidden() );
        }
        Roles.findOne( {
                _id: id,
                team: request.session.team._id
            } )
            .then( roles );

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

        path = path.split( '.' );

        if ( !object ) return false;
        if ( !object[ path[ 0 ] ] ) return false;

        // It's the targeted value
        if ( path.length == 1 ) {

            if ( object[ path[ 0 ] ] === true )
                reply.continue();
            else if ( object[ path[ 0 ] ] === false )
                reply( Boom.forbidden() );

            if ( object[ path[ 0 ] ] === true || object[ path[ 0 ] ] === false )
                return true;

            return false;

        }

        // Deep inspect sub object
        return check( path.slice( 1 )
            .join( '.' ), object[ path[ 0 ] ] );

    }

};
