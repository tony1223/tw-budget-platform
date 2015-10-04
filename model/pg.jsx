

var Promise = require("promise");

var pgp = require('pg-promise')();

var config = require("../config.js");

var db = pgp(config.db);

var queryResult = {
    ONE: 1,     // single-row result is expected;
    MANY: 2,    // multi-row result is expected;
    NONE: 4,    // no rows expected;
    ANY: 6      // (default) = many|none = any result.
};

var load = db.connect();

var links_cache = {};

var p = new Promise((ok,fail)=>{
  load.then(function(con){
      ok([con,queryResult]);
  },(err) => {
    console.log("err",err,err.stack);
  });
});




// var log = function(str){
//   var logs = [];
//   for(var i = 0 ; i < arguments.length;++i){
//     logs.push(arguments[i]);
//   }
//   console.log("[PG]"+logs.join(" "));
// }

// for(var k in methods){
//   (function(old,k){
//     methods[k] = function(){
//       // console.log("into methods:",k);
//       var that = this;
//       var args = arguments;
//       return load.then(function(conn){
//         console.log("[PG]connedted:"+k);
//         var p = old.apply(that,args);
//         if(p.then){
//           p.then(function(){ 
//             console.log("[PG]closed:"+k); 
//           },utils._error("[PG]error:"+k));
//         }
//         return p;
//       });
//     };
//   })(methods[k],k);

// }


export default p;


