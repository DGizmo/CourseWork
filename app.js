var express = require("express");
var app = module.exports = express.createServer();

var sql = require('mssql'); 
 
var config = {user: 'GizmoFM', password: '344012', server: 'GIZMO-PC\\SQLEXPRESS', database: 'GizmoFM',} 


app.configure(function () {
     app.use(express.bodyParser());
 });
 
app.get("/", function(req, res) {
     sql.connect(config, function(err) {
     //    if(err) {
     //        console.log(err);
     //        res.send(500, "Cannot open connection.");
     //    }
     //    else {
                var request = new sql.Request();
                request.execute('test2', function(err, recordsets, returnValue) {
                    //if(err){console.log(err);}
                    //else{
                        var a = recordsets;
                        console.dir(a[0][0].artist);
                      // console.log(recordsets[0][0]); 
                    //}
                 })
      //      };
 });
 });
 
app.listen(10000);