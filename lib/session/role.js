const Boom = require('boom');

module.exports = function checkRole( request, reply ){

    let role = request.route.settings.poetryAuth;

    // No auth check needed
    if( !role )
        return reply.continue();

    // Not logged on
    if( !request.session.isAuthenticated || !request.session.user )
        return reply(Boom.unauthorized());

    // Just need to be logged on
    if( role === true )
        return reply.continue();

    // Need specific role
    if( ~role.indexOf(user.role) )
        return reply.continue;

    // FORBIDDEN
    return reply(Boom.forbidden());

}
