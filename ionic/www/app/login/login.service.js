(function () {
    'use strict';

    angular
        .module('vt.login')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$q', '$log', 'UserApiService'];

    function LoginService($q, $log, UserApiService) {
        var currentUser = null;
        
        return {
            login: function login(email, password) {
                return UserApiService
                    .login(email, password)
                    .then(function (result) {
                        currentUser = result.data;
                        $log.debug('logged in!');
                        return currentUser;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            },
            /**
             * Log out the current user
             * @return {[type]} [description]
             */
            logout: function logout() {
                var deferred;
                if (this.isLoggedIn()) {
                    return UserApiService
                        .logout()
                        .then(function () {
                            currentUser = null;
                        })
                        .catch(function (err) {
                            console.error('Error while logging out: ' + err);
                        });
                } else {
                    deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            },
            getCurrentSession: function getCurrentSession() {
                return currentUser || {};
            },
            isOfficer: function isAdmin() {
                return currentUser ? currentUser.isOfficer : false;
            },
            isLoggedIn: function isLoggedIn() {
                return currentUser !== null;
            },
            refreshUser: function () {
                return UserApiService
                .getUser(currentUser.id)
                .then(function (result) {
                    currentUser = result.data;
                    return currentUser;
                })
            }
        };
    }
})();