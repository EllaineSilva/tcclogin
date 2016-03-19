(function () {
    'use strict';
    angular.module('newProject')
        .controller('MenuCtrl', ['LoginAPI', '$state', '$rootScope', function (LoginAPI, $state, $rootScope) {
            var self = this, menu = true;
            self.abrirMenu = function () {
                if (menu) {
                    self.move = 'move';
                } else {
                    self.move = '';
                }
                menu = !menu;
            };
            self.logout = function () {
                LoginAPI.delCred();
                $state.go('login');
            };
            self.link = '#/newProject/editar/' + $rootScope.id;
        }])
        .controller('SuporteCtrl', ['SendMail', function (SendMail) {
            var self = this;
            self.suporteForm = function () {
                SendMail.save(self.dados);
                delete self.dados;
            };
        }])
        .controller('CadastroCtrl', ['CadastroAPI', function (CadastroAPI) {
            var self = this;
            self.userForm = function () {
                CadastroAPI.save(self.dados);
                delete self.dados;
            };
        }])
        .controller('EditarCtrl', ['dadoUser', 'CadastroAPI', function (dadoUser, CadastroAPI) {
            var self = this;
            self.dados = dadoUser;
            self.editUsuario = function () {
                CadastroAPI.update({id: self.dados.id}, self.dados);
                delete self.dados;
            };
        }])
            .controller('LoginCtrl', ['LoginAPI', '$state', function (LoginAPI, $state) {
            var self = this;
            self.loginForm = function () {
                LoginAPI.geraCred().save(self.user).$promise.then(function (data) {
                    if (data.id) {
                        LoginAPI.setCred(self.user.un.concat(':', self.user.pw));
                        LoginAPI.setId(data.id);
                        $state.go('newProject.cadastro');
                    } else {
                        console.error('Usuário e senha inválidos');
                    }
                });
            };
        }]);
}());