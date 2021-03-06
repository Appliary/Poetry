const Models = require( '../../models' ),
    Log = require( './log' ),
    Bcrypt = require( 'bcrypt' );

const Users = Models.users,
    Teams = Models.teams,
    Sessions = Models.sessions,
    Logs = Models.logs;

module.exports = function login( email, password, isMobile, host, path ) {

    email = email.toLowerCase();

    function checkMobileToken( user, team, session ) {

        Log.silly( 'Login checkMobileToken' );

        return new Promise( ( resolve, reject ) => {
            if ( !( team && team.maxUsers && team.maxUsers > 0 ) ) {
                return resolve( session );
            }

            if ( !isMobile ) {
                Log.silly( 'NOT A MOBILE' );
                Sessions.remove( {
                        user: user._id,
                        $or: [
                            {isMobile: {$exists: false}},
                            {isMobile: {$ne: true}}
                        ]
                    } )
                    .then(
                        res => {
                            Log.silly( 'Removed old session' );
                            resolve( session );
                        },
                        err => {
                            Log.error( err );
                            resolve( session );
                        }
                    );
            } else {
                Log.silly( 'A MOBILE IT IS' );
                session.isMobile = true;
                if ( user.mobileToken ) {
                    Log.silly( 'A MOBILE TOKEN already exists' );
                    return reject( "A session already exists" );
                }

                let userId;
                try {
                    userId = Models.ObjectID( user._id );
                } catch ( e ) {
                    userId = user._id;
                }

                Users.findAndModify( {
                        query: {
                            _id: userId
                        },
                        update: {
                            '$set': {
                                mobileToken: session._id
                            }
                        },
                        new: true
                    } )
                    .then( userUpdated => {
                        if ( !userUpdated ) {
                            Log.debug( 'Error updating USER mobileToken' );
                            return reject( 'Error updating USER mobileToken' );
                        }
                        Log.debug( '$set mobileToken' );
                        userUpdated._id = userUpdated._id.toString();
                        session.user = userUpdated;
                        resolve( session );
                    } )
                    .catch( err => {
                        Log.debug( err );
                        return reject( err );
                    } );
            }
        } );

    }

    return new Promise( ( resolve, reject ) => {

        Users.findOne( {
                email: email,
                status: {
                    $in: [ 'active', 'new' ]
                }
            } )
            .then( user => {


                // TEST USER ==========================
                if ( email == 'test@test.test' &&
                    password == 'testtest' ) {
                    if ( !user ) {
                        Log.verbose( 'Creating test user' );
                        user = {
                            _id: email,
                            email: email,
                            role: "SUPER",
                            team: "test",
                            status: "active"
                        };
                        Users.save( user );
                        Teams.save( {
                            _id: 'test'
                        } );
                    }
                }
                // END TEST USER ======================
                else {
                    // If there is no user
                    if ( !user ) return reject( "User not found" );

                    Log.silly( '👤  User', user.email );

                    if ( !user.password )
                        return reject( "No password set" );

                    // Check password
                    if ( !Bcrypt.compareSync( password, user.password ) )
                        return reject( "Wrong password" );
                }

                // Cleaning user
                delete user.password;
                user._id = user._id.toString();

                // Define new session
                let id = ( Math.random() * 0xFFFFFFFFFFFFFF )
                    .toString( 32 );
                id += '107F4C70RY';
                id += ( Math.random() * 0xFFFFFFFFFFFFFE )
                    .toString( 32 );
                let session = {
                    _id: id,
                    isAuthenticated: true,
                    user: user
                };

                // If there's no team, resolve
                if ( !user.team )
                    return resolve( session );

                // Otherwise populate
                Teams.findOne( {
                        _id: user.team
                    } )
                    .then( team => {

                        session.team = team;
                        checkMobileToken( user, team, session )
                            .then(
                                sess => {
                                    let userId = user._id;
                                    try {
                                        userId = Models.ObjectID( userId );
                                    } catch ( e ) {}

                                    let roleId = user.role;
                                    try {
                                        roleId = Models.ObjectID( roleId );
                                    } catch ( e ) {}

                                    let logsData = {
                                        user: userId,
                                        method: "post",
                                        path: path,
                                        params: {},
                                        team: user.team,
                                        role: roleId
                                    }
                    
                                    // Log the authentication access in the DB :
                                    // because not going through 'onPreAuth' server extension function
                                    // =>so insert logs here
                                    Logs.insert(logsData)
                                    .then(() => { }, () => { });
                                    
                                    resolve( session );
                                },
                                err => {
                                    Log.silly( err );
                                    reject( err );
                                }
                            );

                    } )
                    .catch( err => {
                        Log.error( err );
                        resolve( {} );
                    } );

            } )
            .catch( err => {
                Log.error( err );
                resolve( {} );
            } );

    } );

};
