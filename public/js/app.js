'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addband', {
        templateUrl: 'partials/addBand',
        controller: AddPostCtrl
      }).
      when('/band/:id', {
        templateUrl: 'partials/band',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deleteband/:id', {
        templateUrl: 'partials/deleteBand',
        controller: DeletePostCtrl
      }).
      when('/band/:id/:alb', {
        templateUrl: 'partials/albumInfo',
        controller: AlbumInfoCtrl
      }).
      when('/addalbum/:id', {
        templateUrl: 'partials/addAlbum',
        controller: AddAlbumCtrl
      }).
      /*when('/login', {
        templateUrl: 'partials/login',
        controller: LoginCtrl
      }).
      when('/register', {
        templateUrl: 'partials/register',
        controller: RegistrCtrl
      }).
      */
      when('/editband/:id', {
        templateUrl: 'partials/editBand',
        controller: EditBand
      }).
      when('/editalbum/:id/:alb', {
        templateUrl: 'partials/editAlbum',
        controller: EditAlbum
      }).
      when('/avatar/:id', {
        templateUrl: 'partials/avatar',
        controller: avatar
      }).
      when('/avataralbum/:id', {
        templateUrl: 'partials/avataralbum',
        controller: avataralbum
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);