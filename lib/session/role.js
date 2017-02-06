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
            return reply( Boom.unauthorized() );
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

        // Special handwritten auths
        if ( Array.isArray( auth ) ) {
            let res = auth.some( tag => check(
                `API.${tag}.${ request.route.settings.description }`,
                role
            ) );

            if ( res === true )
                return reply.continue();
            if ( res === false )
                return reply( Boom.forbidden() );
        }

        if ( request.route.settings.tags ) {

            // For descripted routes
            if ( request.route.settings.description ) {

                let res = request.route.settings.tags.some( tag => check(
                    `API.${tag}.${ request.route.settings.description }`,
                    role
                ) );

                if ( res === true )
                    return reply.continue();
                if ( res === false )
                    return reply( Boom.forbidden() );
            }

            // For tagged routes
            let res = request.route.settings.tags.some( tag => check(
                `API.${tag}`,
                role.permissions
            ) );

            if ( res === true )
                return reply.continue();
            if ( res === false )
                return reply( Boom.forbidden() );

        }

        // FORBIDDEN
        Log.silly( 'No permission found', request.route.method, request.route.path );
        return reply( Boom.forbidden() );

    }

};


// Get nested value with dot notation
function check( path, object ) {
    Log.silly( 'Checking role', path, object );

    path = path.split( '.' );

    if ( object === true || object === false )
        return "object"

    if ( !object ) return undefined;
    if ( !object[ path[ 0 ] ] ) return undefined;

    // It's the targeted value
    if ( path.length == 1 )
        return object[ path[ 0 ] ];

    // Deep inspect sub object
    return check( path.slice( 1 )
        .join( '.' ), object[ path[ 0 ] ] );

}
