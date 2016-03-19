(function () {
    'use strict';
    angular.module('newProject')
        .factory('SendMail', ['$resource', function ($resource) {
            return $resource('api/suporte');
        }])
        .factory('CadastroAPI', ['$resource', function ($resource) {
            return $resource('api/cadastro/:id', null, {
                update: {method: 'PUT'}
            });
        }])
        .factory('LoginAPI', ['$cookies', '$resource', function ($cookies, $resource) {
            return {
                geraCred: function () {
                    return $resource('api/login');
                },
                setCred: function (cred) {
                    $cookies.appCreds = window.btoa(cred);
                },
                chkCred: function () {
                    var returnVal = false;
                    if ($cookies.appCreds) {
                        returnVal = true;
                    }
                    return returnVal;
                },
                delCred: function () {
                    $cookies.appCreds = '';
                }
            };
        }]);
}());