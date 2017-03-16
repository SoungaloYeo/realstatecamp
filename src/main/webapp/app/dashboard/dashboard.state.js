(function() {
    'use strict';

    angular
        .module('assessoriaTorrellesApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('dashboard', {
            parent: 'app',
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: 'app/dashboard/layouts/navbar/dashboard.navbar.html',
                    css: 'content/css/dashboard.css',
                    //controller: 'NavbarController',
                    //controllerAs: 'vm'
                },
                'footer@': {
                    templateUrl: 'app/dashboard/layouts/footer/dashboard.footer.html',
                    css: '../content/css/dashboard.css',
                    //controller: 'FooterController',
                    //controllerAs: 'vm'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });
    }
})();