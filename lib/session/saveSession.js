const Log = require( '../methods/log' ),
    Models = require( '../../models' ),
    Sessions = Models.sessions,
    Logs = Models.logs;

module.exports = function saveSession( request, reply ) {

    let isNewSession;

    if ( !request.session || request.session._id === false )
        return reply.continue();

    if ( !request.session._id ) {

        if ( Object.keys( request.session )
            .length <= 1 )
            return reply.continue();

        request.session._id = ( ( Math.random() * 0xFFFFFFFFFFFFFF )
            .toString( 32 ) + ( Math.random() * 0xFFFFFFFFFFFFFF )
            .toString( 32 ) );

        Log.silly( 'New session', request.session._id );
        isNewSession = true;

    }
    reply.state( 'session', request.session._id );

    if ( request.session.user ) {

        if ( typeof request.session.user === 'object' && request.session.user._id ){
            if (isNewSession) {
                let logsData = {
                    user: request.session.user._id,
                    method: request.method,
                    path: request.path,
                    params: request.params,

                    // usefull for the research
                    team: request.session.user.team,
                    role: request.session.user.role
                }


                // Log the authentication access in the DB :
                // not going through 'onPreAuth' server extension function
                // => insert logs 'onPreResponse'
                Logs.insert(logsData)
                .then(() => { }, () => { });
            }
            request.session.user = request.session.user._id;
        }

        if ( typeof request.session.user !== 'string' )
            request.session.user = request.session.user.toString();

    } else request.session.user = undefined;

    if ( typeof request.session.team === 'object' &&
        request.session.team !== null )
        request.session.team = request.session.team._id;
    
    Sessions.save( request.session );

    reply.continue();

};
