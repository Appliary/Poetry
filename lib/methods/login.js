const Models = require( '../../models' ),
    Log = require( './log' );
    Bcrypt = require('bcrypt');

const Users = Models.users,
    Teams = Models.teams;

module.exports = function login( email, password ) {

    return new Promise( ( resolve, reject ) => {

        Users.findOne( {
                email: email,
                status: {
                    $in: [ 'active', 'new' ]
                }
            } )
            .then( ( user ) => {


                // TEST USER ==========================
                if ( !user &&
                    email == 'test@test.test' &&
                    password == 'testtest'
                ) {
                    Log.verbose('Creating test user');
                    user = {
                        _id: email,
                        email: email,
                        role: "admin",
                        team: "test"
                    };
                    Users.save( user );
                    Teams.save( {
                        _id: 'test'
                    } );
                }
                // END TEST USER ======================


                Log.silly('User', user);

                // If there is no user
                if ( !user ) return reject();

                // Check password
                if(user.password && !Bcrypt.compareSync(password, user.password)){
                    console.log("----------Wrong Password Login----------");
                    return reject("Wrong password");
                }

                // Cleaning user
                delete user.password;
                user._id = user._id.toString();

                // Define new session
                let session = {
                    _id: ( ( Math.random() * 0xFFFFFFFFFFFFFF )
                        .toString( 32 ) + ( Math.random() * 0xFFFFFFFFFFFFFF )
                        .toString( 32 ) ),
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
                    .then( ( team ) => {

                        session.team = team;
                        resolve( session );

                    } )
                    .catch( ( err ) => {

                        Log.error( err );
                        resolve( {} );

                    } );

            } )
            .catch( ( err ) => {

                Log.error( err );
                resolve( {} );

            } );

    } );

}
