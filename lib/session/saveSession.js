const Log = require( '../methods/log' ),
    Models = require( '../../models' ),
    Sessions = Models.sessions;

module.exports = function saveSession( request, reply ) {

    if( !request.session ) return reply.continue();

    if ( !request.session._id ) {

        if( Object.keys(request.session).length <= 1 )
            return reply.continue();

        request.session._id = ( ( Math.random() * 0xFFFFFFFFFFFFFF )
            .toString( 32 ) + ( Math.random() * 0xFFFFFFFFFFFFFF )
            .toString( 32 ) );

        Log.silly( 'New session', request.session._id );
        reply.state( 'session', request.session._id );

    }

    if(typeof request.session.user === 'object')
        request.session.user = request.session.user._id;

    if(typeof request.session.team === 'object')
        request.session.team = request.session.team._id;

    Sessions.update( {
        _id: request.session._id
    }, request.session, {
        upsert: true
    } );

    reply.continue()

}