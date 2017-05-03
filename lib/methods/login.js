const Models = require('../../models'),
    Log = require('./log'),
    Bcrypt = require('bcrypt');

const Users = Models.users,
    Teams = Models.teams,
    Sessions = Models.sessions;

module.exports = function login(email, password, isMobile) {

    function checkMobileToken(user, team, session) {

        Log.silly('Login checkMobileToken');

        return new Promise((resolve, reject) => {
            /*if(!(team && team.maxUsers && team.maxUsers > 0)){
                return resolve(session);
            }*/

            if (!isMobile) {
                Log.silly('NOT A MOBILE');
                Sessions.remove({
                    user: user._id
                }).then(
                    res => { resolve(session); },
                    err => {
                        Log.error(err);
                        resolve(session);
                    }
                    );
            }
            else {
                Log.silly('A MOBILE IT IS');
                session.isMobile = true;
                if (user.mobileToken) {
                    Log.debug('A MOBILE TOKEN already exists ------------------------------------------------------------------<');
                    return reject("A session already exists");
                }

                Users.findAndModify({
                    query: {
                        _id: Models.ObjectID(user._id)
                    },
                    update: {
                        '$set': {
                            mobileToken: Models.ObjectID(session._id)
                        }
                    },
                    new: true
                }).then(userUpdated => {
                    Log.debug('UPDATE USER ------------------------------------------------------------------<');
                    Log.debug('SESSION ID = ', session._id);
                    Log.debug('MOBILE TOKEN = ', session._id);
                    Log.debug('USER ID and EMAIL = ', user._id, user.email);
                    if (!userUpdated) {
                        Log.debug('Error updating USER mobileToken');
                        return reject('Error updating USER mobileToken')
                    }
                    resolve(session);
                });
            }
        });

    }

    return new Promise((resolve, reject) => {

        Users.findOne({
            email: email,
            status: {
                $in: ['active', 'new']
            }
        })
            .then(user => {


                // TEST USER ==========================
                if (email == 'test@test.test' &&
                    password == 'testtest') {
                    if (!user) {
                        Log.verbose('Creating test user');
                        user = {
                            _id: email,
                            email: email,
                            role: "SUPER",
                            team: "test",
                            status: "active"
                        };
                        Users.save(user);
                        Teams.save({
                            _id: 'test'
                        });
                    }
                }
                // END TEST USER ======================
                else {
                    // If there is no user
                    if (!user) return reject("User not found");

                    Log.silly('👤  User', user.email);

                    if (!user.password)
                        return reject("No password set");

                    // Check password
                    if (!Bcrypt.compareSync(password, user.password))
                        return reject("Wrong password");
                }

                // Cleaning user
                delete user.password;
                user._id = user._id.toString();

                // Define new session
                let id = (Math.random() * 0xFFFFFFFFFFFFFF)
                    .toString(32);
                id += '107F4C70RY';
                id += (Math.random() * 0xFFFFFFFFFFFFFE)
                    .toString(32);
                let session = {
                    _id: id,
                    isAuthenticated: true,
                    user: user
                };

                // If there's no team, resolve
                if (!user.team)
                    return resolve(session);

                // Otherwise populate
                Teams.findOne({
                    _id: user.team
                })
                    .then(team => {

                        session.team = team;
                        checkMobileToken(user, team, session).then(
                            sess => {
                                resolve(session);
                            },
                            err => {
                                Log.silly(err);
                                reject(err)
                            }
                        );

                    })
                    .catch(err => {
                        Log.error(err);
                        resolve({});
                    });

            })
            .catch(err => {
                Log.error(err);
                resolve({});
            });

    });

};
