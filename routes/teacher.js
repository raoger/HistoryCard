var db = require("./postgresql");
//import module fs(file system)
var fs = require("fs");
//import handlebars to render
var handlebars = require("handlebars");
//to set path import path module
var path = require("path");
//future use
var curr='/teacher';


var sync = require("synchronize");

function check(type){
    if(type==="teacher") return true;
    else return false;
}

module.exports = function(routes,session) {
    
    // "/" to display user.html as it is in student route already 
    routes.get('/', function(req, res){
        console.log("teacher "+req.session.user+"page request");//debug
        if(check(req.session.type)) {
            
            var data={};
            var querydata = {};
            querydata.id = req.session.user;
            querydata.type = 'facultyAdv'
            db.get_stud_list(req.session.user,'history',querydata,function(val){
                if(val == {}){
                }
                else{
                console.dir(val);
                data['student'] = val;
                data.username=req.session.user;
                }
                res.render('teacher',data);
                });
            //});
        }
        else {
            //without login so redirect to login page
            res.redirect('/');
        }
      
    });
    routes.get('/report',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /teacher/report");//debug
            //refer postgresql.js
            db.student_mark(req.query.rrn,req.query.sem,'2013-2017',function(result){
                if(result){
                    res.status(200).send(result);
                }
                else{
                    res.send("error");
                }
            });
        } 
    });
    routes.get('/foss-graph',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /teacher/foss-graph");//debug
            //refer postgresql.js
            db.fossgraph(function(result){
                if(result){
                    res.status(200).send(result);
                }
                else{
                    res.send("error");
                }
            });
        } 
    });
    routes.get('/credits',function(req,res){
        if(check(req.session.type)){//check user
            console.log(req.query.rrn+" AJAX /teacher/credits");//debug
            //refer postgresql.js
            db.sem_credits_all(req.query.rrn,'2013-2017',function(result){
                if(result){
                    res.status(200).send(result);
                }
                else{
                    res.send("error");
                }
            });
        }
        else{
            res.redirect('/');
        }
    });
    //AJAX request /cgpa to get cgpa
    routes.get('/cgpa',function(req,res){
        console.log(req.query.rrn+" AJAX /teacher/cgpa");
        db.cgpa(req.query.rrn,8,'2013-2017',function(x,result){
            if(result){
                console.dir(result);
                res.status(200).send(result);
            }
            else{
                res.send("error");
            }
        });
    });
    
    // 
    routes.get("/role-list", function(req, res) {
        if(check(req.session.type)) {
            var data = {};
            data["id"]=req.session.user;
            sync.fiber(function() {
              sync.parallel(function(){
                   
                db.showClassadv('Admin1','history',data,sync.defer());
                db.showFacadv('Admin1','history',data,sync.defer());
                db.showSubjectTeach('Admin1','history',data,sync.defer());
                
              });
              var ans = sync.await();
              var k =[].concat.apply([], ans);
              res.send({"id":req.query.id,"assignments":k});
            })
        }
        else {
            res.redirect("/");
        }
    });
    routes.get('/stud-list',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /stud-list");//debug
            //refer postgresql.js
            var data={};
            var querydata = {};
            querydata.id = req.session.user;
            querydata.type = 'facultyAdv';
            db.get_stud_list(req.session.user,'history',querydata,function(val){
                if(val == {}){
                    
                }
                else{
                console.dir(val);
                data['student'] = val;
                data.username=req.session.user;
                res.send(data);
                }
                //send to the client
            });
        }
    });
};