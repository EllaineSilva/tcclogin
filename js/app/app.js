(function () {
    'use strict';
    angular.module('newProject', ['ui.router', 'ngResource', 'ngCookies'])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProviders) {
            $stateProvider
                .state('newProject', {
                    url: '/newProject',
                    abstract: true,
                    templateUrl: 'partials/menu.html',
                    controller: 'MenuCtrl as menu',
                    data: {
                        auth: true
                    }
                })
                .state('newProject.suporte', {
                    url: '/suporte',
                    templateUrl: 'partials/suporte.html',
                    controller: 'SuporteCtrl as mail'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'partials/login.html',
                    controller: 'LoginCtrl as login',
                    data: {
                        auth: false
                    }
                })
                .state('suporte', {
                    url: '/suporte',
                    templateUrl: 'partials/suporte.html',
                    controller: 'SuporteCtrl as mail',
                    data: {
                        auth: false
                    }
                })
                .state('newProject.cadastro', {
                    url: '/cadastro',
                    templateUrl: 'partials/cadastro.html',
                    controller: 'CadastroCtrl as cad'
                })
                .state('newProject.editar', {
                    url: '/editar/:id',
                    templateUrl: 'partials/editar.html',
                    controller: 'EditarCtrl as edit',
                    resolve: {
                        dadoUser: ['CadastroAPI', '$stateParams', function (CadastroAPI, $stateParams) {
                            return CadastroAPI.get({id: $stateParams.id}).$promise;
                        }]
                    }
                })
            $urlRouterProviders.otherwise('/login');
        }])
        .run(['$rootScope', '$state', 'LoginAPI', function ($rootScope, $state, LoginAPI) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.data.auth && !LoginAPI.chkCred()) {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        }]);
}());