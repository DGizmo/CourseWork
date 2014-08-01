var sql = require('mssql');
var fs = require('fs');  
var config = {user: 'GizmoFM', password: '344012', server: 'GIZMO-PC\\SQLEXPRESS', database: 'GizmoFM',} 

/*var data = {
  "posts": [
    {
      "title": "",
      "text": ""
    }
  ]
};
*/

var kol;

    sql.connect(config, function(err) {
       
                var request = new sql.Request();
                request.query('select MAX(id) as qty from Artist', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                              kol = recordsets[0].qty;
                   console.log(kol);
                    }
                 })
    });




// GET

exports.posts = function (req, res) {
  var posts = [];
    sql.connect(config, function(err) {
       
                var request = new sql.Request();
                request.execute('artistAll', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                                recordsets[0].forEach(function (post, i) {
                                  posts.push({
                                    id: recordsets[0][i].id,
                                    title: recordsets[0][i].artist ,
                                    pic: recordsets[0][i].artist_art
                                  });
                                });
                                res.json({
                                  posts: posts
                                });
                        console.log("art = ",recordsets[0][1].artist_art);
                        console.log(recordsets[1]);
                   
                    }
                 })
    });
};

exports.post = function (req, res) {

  var posts = {
  "artist": [
    ],
  "album": [
    ]
  };
      sql.connect(config, function(err) {
       
                var request = new sql.Request();
                var name = req.params.id;
                console.log("Имя = "+name);;
                request.input('art_name', name);
                request.execute('artist_info', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                          //console.log("Read this = "+recordsets[0][0].artist);          
                          posts.artist.push({
                                    artist: recordsets[0][0].artist,
                                    rise: recordsets[0][0].rise,
                                    country: recordsets[0][0].country,
                                    artist_art: recordsets[0][0].artist_art
                                  });

                            recordsets[0].forEach(function (post, i) {
                                  posts.album.push({
                                    album_name: recordsets[0][i].album_name,
                                    album_art: recordsets[0][i].album_art,
                                  });
                                });
                                res.json(
                                  posts
                                //  posts: posts
                                );
                        //console.log("well = %j",posts);
                      
                        
                        //console.log(posts.album_name[0]);
                        //console.log(posts.album_name[1]);
                             
                   
                    }
                 })
    });
};

exports.bio = function (req, res) {
  var a,b,count=0;
  var bio ={
    "bio":[],
    "info":[],
    "genre":[]
  }
  var name = req.params.alb;
  console.log("параметры  = ",name);
    sql.connect(config, function(err) {
       
                var request = new sql.Request();
                request.input('alb_name', name);
                request.execute('ShowTracks', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                                recordsets[0].forEach(function (post, i) {
                                  b = recordsets[0][i].track_time;
                                  count+=b; 
                                  a = b/60>>0;
                                  a = b%60==0?a+":00": a=b%60<10?a+":0"+b%60:a+":"+b%60;
                                  bio.bio.push({
                                    num: i+1,
                                    name: recordsets[0][i].track_name,
                                    time: a 
                                  });
                                });

                                a = count/60>>0;
                                a = count%60==0?a+":00": a=count%60<10?a+":0"+count%60:a+":"+count%60;

                                if(recordsets[0][0].track_name==null) {
                                  bio.bio[0].num=null;
                                  bio.bio[0].time=null;
                                }

                                recordsets[1].forEach(function (post, i) {
                                  bio.info.push({
                                     artist:    recordsets[1][0].artist,
                                     album:     recordsets[1][0].album_name,
                                     artist_art:recordsets[1][0].artist_art,
                                     track_sum: recordsets[1][0].tracks_sum,
                                     album_art: recordsets[1][0].album_art,
                                     relise:    recordsets[1][0].relise,
                                     count:     a
                                  });
                                });

                                recordsets[2].forEach(function (post, i) {
                                  bio.genre.push(recordsets[2][i].genre_name)
                                });
                                
                                console.log("genre = ",bio.genre);
                                //console.log(bio);
                                //console.log("time = ",bio[0]);
                                res.json(bio);
                        console.log(bio.info);
                             
                   
                    }
                 });
    });
};

// POST

exports.addPost = function (req, res) {
  //console.log("body? = %j",req);
  console.log("file = ",req.files.foto.name);
  //console.log("file = ",req.files.foto);
  console.log("kol = "+kol);
  kol++;
  //art = "заглушка";
  var art = req.body.artist+'.png';
  art = art.split(' ').join('_');
  req.files.foto.name = art;
  //console.log("body = ",picname);
  //console.log(req.files.foto.path);
  
  var tmp_path = req.files.foto.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/pic/artist/' + req.files.foto.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.files.foto.size + ' bytes');
        });
    });
  



  sql.connect(config, function(err) {
       
                var request = new sql.Request();
                request.input('id', kol);
                request.input('name', req.body.artist);
                request.input('rise', req.body.rise);
                request.input('country', req.body.country);
                request.input('artist_art', art); 
                request.execute('artist_add', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                          res.end("<script>window.location.href = 'http://localhost:3000'; location.reload()</script>");

                    }
                 })
  });

};

exports.addAlbum = function (req, res) {
  console.log("body? = %j",req.body);
  console.log("body.length = %j",req.body.length);
  console.log("id = %j",req.params.id);
  var art = "заглушка";
  var N = req.body.length; //-1; //c добавлением жанров сюда прилетело -1
  var name,ttime,request;

console.log(req.body[N-1].album_name);
//console.log("Что же здесь = %j",req.body[N][0][0].name);


  sql.connect(config, function(err) {       
                request = new sql.Request();
                request.input('alb_name', req.body[N-1].album_name);              //+
                request.input('artist_name', req.params.id); //+
                request.input('pic', art); //заглушка        //+
                request.input('relise', req.body[N-1].relise);   //+
                request.execute('AlbumAdd', function(err, recordsets, returnValue) {
                   if(err){
                    console.log(err);
                    //res.json(false);
                   }
                    else{
                      //  res.json(true);
                          console.log("Альбом создан");
                    }
                 });

                for(i=0;i<N-1;i++){
                  request = new sql.Request();
                  name = req.body[i].name;
                  ttime = parseInt(req.body[i].min) *60 + parseInt(req.body[i].sec);
                  request.input('alb_name', req.body[N-1].album_name); //+
                  request.input('track_name', name);                    //+
                  request.input('track_time', ttime);   //+
                  request.execute('TracksAdd', function(err, recordsets, returnValue) {
                    if(err){
                    console.log(err);
                    //res.json(false);
                   }
                    else{
                      //  res.json(true);
                      console.log("Трек создан "+i);
                    }

                  });
                }
                
/*
                request = new sql.Request();
                req.body[N][0].forEach(function (post, i) {
                               
                               for(j=0;j<recordsets[0].length;j++){
                                var request2 = new sql.Request();
                                if(req.body[N][0][i]==recordsets[0][j]){
                                  request2.query('select MAX(id) as qty from Artist', function(err, recordsets, returnValue) {
                                     if(err){console.log(err);}
                                      else{
                                            
                                      }
                                   })
                                    вставляться по этому адресу
                                  break;  
                                  }
                                else{
                                    заводиться новый жанр
                                  }
                               }
                });
   
   */             
  });

  console.log("попал в addAlbum");
  res.json(true);
  //data.posts.push(req.body);
  //alert("Группа успешно добавлена!");
  //res.json(req.body);
};


// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.editBand = function (req, res) {
  sql.connect(config, function(err) { 
                var request = new sql.Request();
                request.input('id', req.params.id);
                request.input('artist', req.body.artist);
                request.input('rise', req.body.rise);
                request.input('country', req.body.country); 
                request.execute('UpdateArtist', function(err, recordsets, returnValue) {
                   if(err){console.log(err);}
                    else{
                      res.json(true);

                    }
                })
  });
  
};

exports.editAlbum = function (req, res) {
  
  console.log("alb = ",req.params.alb);

  var N = req.body.length; //-1; //c добавлением жанров сюда прилетело -1
  var name,ttime,request;

console.log(req.body[N-1].album_name);
console.log(req.params.alb);
console.log(req.body[N-1].relise);

  sql.connect(config, function(err) {       
                request = new sql.Request();
                request.input('old', req.params.alb); //+
                request.input('newname', req.body[N-1].album_name);              //+
                request.input('relise', req.body[N-1].relise);   //+
                request.execute('UpdateAlbum', function(err, recordsets, returnValue) {
                   if(err){
                    console.log(err);
                    //res.json(false);
                   }
                    else{
                      //  res.json(true);
                          console.log("Альбом создан");
                    }
                 });
/*
                for(i=0;i<N-1;i++){
                  request = new sql.Request();
                  name = req.body[i].name;
                  ttime = parseInt(req.body[i].min) *60 + parseInt(req.body[i].sec);
                  request.input('alb_name', req.body[N-1].album_name); //+
                  request.input('track_name', name);                    //+
                  request.input('track_time', ttime);   //+
                  request.execute('TracksAdd', function(err, recordsets, returnValue) {
                    if(err){
                    console.log(err);
                    //res.json(false);
                   }
                    else{
                      //  res.json(true);
                      console.log("Трек создан "+i);
                    }

                  });
                }
  */           
  });

  res.json(true);

};

// DELETE

exports.deletePost = function (req, res) {
  console.log(req.params);
  var name = req.params.id;
  console.log("имя кого хочу удалить= "+name);

    sql.connect(config, function(err) {     
                var request = new sql.Request();
                request.input('art', name);
                request.execute('artist_delete', function(err, recordsets, returnValue) {
                   if(err){
                            console.log(err);
                            //alert("Операция удаления проведена с ошибкой, попробуйте снова!");
                            res.json(false);}
                    else{
                            //alert("Операция удаления успешно проведена");
                           res.json(true); 
                    }
                 })
    });

};

exports.deleteAlbum = function (req, res) {
  console.log(req.params);
  var name = req.params.alb;
  console.log("имя кого хочу удалить= "+name);

    sql.connect(config, function(err) {     
                var request = new sql.Request();
                request.input('alb_name', name);
                request.execute('DeleteAlbum', function(err, recordsets, returnValue) {
                   if(err){
                            console.log(err);
                            //alert("Операция удаления проведена с ошибкой, попробуйте снова!");
                            res.json(false);}
                    else{
                            //alert("Операция удаления успешно проведена");
                           res.json(true); 
                    }
                 })
    });

};

exports.avatar = function (req, res) {

 var art = req.params.id+'.png';
  art = art.split(' ').join('_');
  req.files.foto.name = art;
  
  console.log(req.params.id);
  console.log(req.files.foto.name);
  
  fs.unlink('./public/pic/artist/' + art, function() {});
  var tmp_path = req.files.foto.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/pic/artist/' + req.files.foto.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.files.foto.size + ' bytes');
        });
    });
        sql.connect(config, function(err) {     
                var request = new sql.Request();
                request.input('id', req.params.id);
                request.input('pic', art);
                request.execute('UpdateAva', function(err, recordsets, returnValue) {
                   if(err){
                            console.log(err);
                       
                    }else{
              res.end("<script>window.location.href = 'http://localhost:3000/band/"+req.params.id+"'</script>");
              
                    }
                 })
    });



};

exports.avataralbum = function (req, res) {

 var art = req.params.id+'.jpg';
  art = art.split(' ').join('_');
  req.files.foto.name = art;
  

  console.log("id = ",req.params.id);
  console.log("art = ",art);
  
  
  fs.unlink('./public/pic/album/' + art, function() {});
  var tmp_path = req.files.foto.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/pic/album/' + req.files.foto.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.files.foto.size + ' bytes');
        });
    });
    
        sql.connect(config, function(err) {     
                var request = new sql.Request();
                request.input('id', req.params.id);
                request.input('pic', art);
                request.execute('UpdateAvaAlbum', function(err, recordsets, returnValue) {
                   if(err){
                            console.log(err);
                       
                    }else{
              res.end("<script>window.location.href = 'http://localhost:3000'</script>");
              
                    }
                 })
    });



};
//--------------PASSPORT JS-----------------
/*
module.exports.login = function(req, res, next) {
  passport.authenticate('local',
    function(err, user, info) {
      return err 
        ? next(err)
        : user
          ? req.logIn(user, function(err) {
              return err
                ? next(err)
                : res.redirect('/private');
            })
          : res.redirect('/');
    }
  )(req, res, next);
};

// Здесь все просто =)
module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
module.exports.register = function(req, res, next) {
  var user = new User({ username: req.body.email, password: req.body.password});
  user.save(function(err) {
    return err
      ? next(err)
      : req.logIn(user, function(err) {
        return err
          ? next(err)
          : res.redirect('/private');
      });
  });
};

exports.mustAuthenticatedMw = function (req, res, next){
  req.isAuthenticated()
    ? next()
    : res.redirect('/');
};
*/