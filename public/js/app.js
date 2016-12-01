// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('xmasMapApp', ['ngAnimate', 'mainCtrl', 'addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'AuthService', 'ngRoute',
    'rating', 'headroom', 'bootstrap.fileField','angularReverseGeocode', 'ui.bootstrap'])
    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider) {

        // Join Team Control Panel
        $routeProvider.when('/', {
            controller: 'mainCtrl',
            templateUrl: 'partials/main.html'
        });
            // Find Teammates Control Panel
        // }).when('/find', {
        //     controller: 'queryCtrl',
        //     templateUrl: 'partials/queryForm.html',
        //
        //     // All else forward to the Join Team Control Panel
        // }).otherwise({redirectTo:'/'})
    }).run(function ($rootScope, $location, $route, AuthService) {
        $rootScope.$on('$routeChangeStart',
            function (event, next, current) {
                AuthService.getUserStatus()
                    .then(function(){
                        // if (next.access.restricted && !AuthService.isLoggedIn()){
                        //     $location.path('/');
                        //     $route.reload();
                        // }
                    });
            });
    });

