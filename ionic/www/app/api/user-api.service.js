(function () {
    'use strict';
    angular.module('vt.api')
        .factory('UserApiService', UserApiService);

    function UserApiService ($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            login: function login(email, password) {
                var deferred = $q.defer();

                $http.post(BASE_API_URL + '/login', {email: email, password: password})
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            logout: function logout() {
                var deferred = $q.defer();

                $http.delete(BASE_API_URL + '/logout')
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            getUsers: function getUsers () {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/users')
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            updateUser: function updateUser (user) {
                var deferred = $q.defer();
                
                $http.put(BASE_API_URL + '/users/' + user.id, user)
                .success(function (data, status) {
                    deferred.resolve({data: data, status: status});
                })
                .error(function (data, status) {
                    ApiErrorHandlingService.handleResponseError(data, status);
                    deferred.reject({data: data, status: status});
                });
                
                return deferred.promise;
            }
        };
    }
})();
