'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $scope.form = {};
      });
  };
}


function AddAlbumCtrl($scope, $http, $location,$routeParams) {
  $scope.route = $routeParams.id;
  $scope.tracks = [];
  $scope.genre = [];
  $scope.addTrack = function() {
    if($scope.tName!=undefined && $scope.tMin!=undefined && $scope.tSec!=undefined){ 
      if($scope.tName.length>0 && $scope.tMin.length>0 && $scope.tSec.length>0){
        if(isFinite($scope.tMin) && isFinite($scope.tSec)){
          if($scope.tSec<60){
            if($scope.tSec==0)$scope.tSec='00';
            if($scope.tSec<10)$scope.tSec='0'+$scope.tSec;       
            $scope.tracks.push({name:$scope.tName,min:+$scope.tMin,sec:$scope.tSec,done:false});
            $scope.tName = '';
            $scope.tMin = '';
            $scope.tSec = ''; 
            console.log($scope.tracks); 
          }
        }
      }
    }
  };
 
  $scope.deleteTrack = function() {
    var oldTodos = $scope.tracks;
    $scope.tracks = [];
    angular.forEach(oldTodos, function(track) {
      if (!track.done) $scope.tracks.push(track);
    });

    var oldGenres = $scope.genre;
    $scope.genre = [];
    angular.forEach(oldGenres, function(genre) {
      if (!genre.done) $scope.genre.push(genre);
    });
  };

  $scope.addGenre = function(){
    if($scope.aGenre!=undefined ){ 
      if($scope.aGenre.length>0 ){
        $scope.genre.push({name:$scope.aGenre,done:false}); 
        $scope.aGenre = ''; 
        console.log($scope.genre); 
      }
    }       
  };
  


  $scope.submitAlbum = function () {
    //var a=[]; a.push($scope.genre);
    if($scope.tracks.length>0 && isFinite($scope.tracks.relise)){
       $scope.tracks.push({album_name:$scope.tracks.album_name, relise: $scope.tracks.relise});
      // $scope.tracks.push(a);
        console.log($scope.tracks.length);
        $http.post('/api/addAlbum/'+ $routeParams.id, $scope.tracks).
          success(function(data) {
            if(data) $location.url('/band/' + $routeParams.id);
            else alert("Произошла ошибка, пожалуйста обратитесь к администратору!");
            $scope.tracks = {};
          });
    }
  };
}

function ReadPostCtrl($scope, $http, $routeParams,$location) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      console.log("Data in controlle: = ",data.album[0]);
      if(data.album[0].album_name == null) data.album=null;
      $scope.post = data;
    });

}

function AlbumInfoCtrl($scope, $http, $routeParams,$location) {
  $http.get('/api/post/' + $routeParams.id + '/'+$routeParams.alb).
    success(function(data) {
      console.log("my bio : = ",data.genre);
      console.log($routeParams);
      $scope.bio = data;
      $scope.info = data.info[0];
    });

  $scope.deleteAlbum = function () {
    $http.delete('/api/deleteAlbum/' + $routeParams.alb).
      success(function(data) {
        $location.url('/band/' + $routeParams.id);
      });
  };
}
/*
function LoginCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/login/').
    success(function(data) {

    });
}function RegistrCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/register/').
    success(function(data) {

    });
}*/
function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/posts/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.artist[0];
      console.log("delete data = %j",data.artist[0]);
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  

  $scope.home = function () {
    $location.url('/');
  };
}


function EditBand($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.artist[0];
    });

  $scope.editBand = function () {
    $http.put('/api/editBand/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/band/' + $routeParams.id);
      });
  };
}
function EditAlbum($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.tracks = [];
  var a,b;
  $http.get('/api/post/' + $routeParams.id+'/'+$routeParams.alb).
    success(function(data) {
      $scope.form = data;
      data.bio.forEach(function (post, i) {
      a = data.bio[i].time[0];
      b = data.bio[i].time[2]+""+data.bio[i].time[3];
      $scope.tracks.push({name:data.bio[i].name,min:a,sec:b,done:false})
      }); 

    });

  $scope.route = $routeParams.id;
  $scope.genre = [];

  $scope.addTrack = function() {
    if($scope.tName!=undefined && $scope.tMin!=undefined && $scope.tSec!=undefined){ 
      if($scope.tName.length>0 && $scope.tMin.length>0 && $scope.tSec.length>0){
        if(isFinite($scope.tMin) && isFinite($scope.tSec)){
          if($scope.tSec<60){
            if($scope.tSec==0)$scope.tSec='00';
            if($scope.tSec<10)$scope.tSec='0'+$scope.tSec;       
            $scope.tracks.push({name:$scope.tName,min:+$scope.tMin,sec:$scope.tSec,done:false});
            $scope.tName = '';
            $scope.tMin = '';
            $scope.tSec = ''; 
            console.log($scope.tracks); 
          }
        }
      }
    }
  };

  $scope.deleteTrack = function() {
    var oldTodos = $scope.tracks;
    $scope.tracks = [];
    angular.forEach(oldTodos, function(track) {
      if (!track.done) $scope.tracks.push(track);
    });

    var oldGenres = $scope.genre;
    $scope.genre = [];
    angular.forEach(oldGenres, function(genre) {
      if (!genre.done) $scope.genre.push(genre);
    });
  };
  console.log($routeParams);
  $scope.submitAlbum = function () {
    if($scope.tracks.length>0 && isFinite($scope.form.info[0].relise)){
       $scope.tracks.push({album_name:$scope.form.info[0].album, relise: $scope.form.info[0].relise});

        $http.put('/api/editAlbum/'+ $routeParams.id+'/'+$routeParams.alb, $scope.tracks).
          success(function(data) {
            if(data) $location.url('editAlbum/'+ $routeParams.id+'/'+$routeParams.alb);
            else alert("Произошла ошибка, пожалуйста обратитесь к администратору!");
           // $scope.tracks = {};
          });
    }
  };
  
}
function avatar($scope, $http, $location, $routeParams) {
   $scope.post = $routeParams.id;

   $scope.submitPost = function () {
    console.log("message");
    $http.post('/api/avatar/'+$routeParams.id).
      success(function(data) {
        //$scope.form = {};
      });
  };
}

function avataralbum($scope, $http, $location, $routeParams) {
   $scope.post = $routeParams.id;

   $scope.submitPost = function () {
    console.log("message");
    $http.post('/api/avataralbum/'+$routeParams.id).
      success(function(data) {
        //$scope.form = {};
      });
  };
}

/*function TracksAddCtrl($scope, $http, $location, $routeParams) {
  $scope.tracks = [];
 
  $scope.addTrack = function() {
    if($scope.tName!=undefined && $scope.tMin!=undefined && $scope.tSec!=undefined){ 
      if($scope.tName.length>0 && $scope.tMin.length>0 && $scope.tSec.length>0){
        if(isFinite($scope.tMin) && isFinite($scope.tSec)){
          if($scope.tSec==0)$scope.tSec='00';       
          $scope.tracks.push({name:$scope.tName,min:+$scope.tMin,sec:$scope.tSec,done:false});
          $scope.tName = '';
          $scope.tMin = '';
          $scope.tSec = ''; 
        }
      }
    }
  };
 
  $scope.deleteTrack = function() {
    var oldTodos = $scope.tracks;
    $scope.tracks = [];
    angular.forEach(oldTodos, function(track) {
      if (!track.done) $scope.tracks.push(track);
    });
  };
}
*/