const Boom = require('boom');

module.exports = function checkRole( request, reply ){

    // No auth check needed
    if( !request.settings.plugins.poetryAuth )
        return reply.continue();

    // Not logged on
    if( !request.session.isAuthenticated || !request.session.user )
        return reply(Boom.unauthorized());

    // Just need to be logged on
    if( request.settings.plugins.poetryAuth === true )
        return reply.continue();

    // Need specific role
    if( ~request.settings.plugins.poetryAuth.indexOf(user.role) )
        return reply.continue;

    // FORBIDDEN
    return reply(Boom.forbidden());

}
