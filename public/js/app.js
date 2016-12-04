// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('xmasMapApp', ['ngAnimate', 'mainCtrl', 'addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'AuthService', 'ngRoute',
    'rating', 'headroom', 'bootstrap.fileField','angularReverseGeocode', 'ui.bootstrap', 'vsGoogleAutocomplete', 'infinite-scroll',
    'toastr'])
    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider) {

        // Join Team Control Panel
        $routeProvider.when('/', {
            controller: 'mainCtrl',
            templateUrl: 'partials/main.html'
        });
    }).run(function ($rootScope, $location, $route, AuthService) {
        $rootScope.$on('$routeChangeStart',
            function (event, next, current) {
                AuthService.getUserStatus();
            });
    }).config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            newestOnTop: false,
            positionClass: 'toast-bottom-right'
        });
    });


