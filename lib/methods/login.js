const Models = require( '../../models' );

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
                    user = {
                        _id: email,
                        email: email,
                        role: "admin",
                        team: "test"
                    };
                    Users.insert( user );
                }
                // END TEST USER ======================

                // If there is no user
                if ( !user ) return reject();

                //TODO Check password

                Poetry.log.verbose( 'Authenticated', user.email );

                // Cleaning user
                delete user.password;

                // Define new session
                let session = {
                    isAuthenticated: true,
                    user: user
                };

                // If there's no team, resolve
                if( !user.team )
                    return resolve( session );

                // Otherwise populate
                Teams.find( {
                        _id: user.team
                    } )
                    .then( ( team ) => {

                        session.team = team;
                        resolve( session );

                    } )
                    .catch( reject );

            })
            .catch( reject );

    } );

}
