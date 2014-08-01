var express = require("express");
var routes = require('./routes');
var api = require('./routes/api');
var app = module.exports = express.createServer();

var sql = require('mssql'); 
 
var config = {user: 'GizmoFM', password: '344012', server: 'GIZMO-PC\\SQLEXPRESS', database: 'GizmoFM',} 


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


//app.get('/', routes.index);
 var a=1,b;
app.get("/", function(req, res) {
     sql.connect(config, function(err) {
         if(err) {
             console.log(err);
             res.send(500, "Cannot open connection.");
         }
         else {
                var request = new sql.Request();
               // request.input('artid', 1);
                request.query('select track_name, track_time from Track_list', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                        //a = recordsets[0][0];
                        console.log(recordsets);
                        console.log(recordsets[1].track_time);
                        b = recordsets[1].track_time;
                        a = b/60>>0;
                        b = b%60;
                        var c = a+":"+b;
                        console.log(a);
                        console.log(b);
                        console.log(c);
                        res.end();
                      // console.log(recordsets[0][0]); 
                    }
                 })
            };
      });
    /*      sql.connect(config, function(err) {
         if(err) {
             console.log(err);
             res.send(500, "Cannot open connection.");
         }
         else {
                var request = new sql.Request();
                //request.input('artid', 1);
                request.execute('artistAll', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                        //a = recordsets[0][0];
                        console.dir(recordsets);
                       
                        res.end(recordsets[0][0].artist);
                      // console.log(recordsets[0][0]); 
                    }
                 })
            };
      });*/
 });

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});