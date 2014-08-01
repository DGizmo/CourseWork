var sql = require('mssql');  
var config = {user: 'GizmoFM', password: '344012', server: 'GIZMO-PC\\SQLEXPRESS', database: 'GizmoFM',} 

var connection = new sql.Connection(config, function(err) {
 
 	if(err) console.log(err);   // ... error checks
});