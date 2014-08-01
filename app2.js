
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'SECRET' }));
});

app.use(passport.initialize());
app.use(passport.session());


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/posts', api.posts);
app.get('/api/post/:id/:alb', api.bio);
app.get('/api/post/:id', api.post);

app.post('/api/post', api.addPost);
//app.post('/addband', api.addband);
app.post('/api/addAlbum/:id', api.addAlbum);

app.post('/api/avatar/:id', api.avatar);
app.post('/api/avataralbum/:id', api.avataralbum);


app.put('/api/editBand/:id', api.editBand);
app.put('/api/editAlbum/:id/:alb', api.editAlbum);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);
app.delete('/api/deleteAlbum/:alb', api.deleteAlbum);

app.post('/login', api.login);
app.post('/register', api.register);
app.get('/logout', api.logout);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


//passport js
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username},function(err,user){
    return err 
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null,user);
  });
});


app.all('private', api.mustAuthenticatedMw);
app.all('private/*', api.mustAuthenticatedMw);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

