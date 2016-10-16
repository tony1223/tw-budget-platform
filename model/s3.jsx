


var AWS = require('aws-sdk');

import config from "../config.js";

AWS.config.update({accessKeyId: 
  config.aws.accesskey, 
  secretAccessKey: config.aws.token 
});

var s3 = new AWS.S3({region: "ap-northeast-1"});
var zlib = require("zlib");

export default {
  putS3:function(){
    
  },
  readS3:function(bucket,key){
    if(key == null || bucket == null){
      return Promise.reject(null);
    }
    console.log("calls3",bucket,key);

    try{
      var params = {Bucket: bucket, Key: key};
      console.log(s3.getSignedUrl('getObject',params));

      var p = new Promise((ok,fail)=>{
          s3.getObject(params,(err,obj)=>{
            console.log("getObj",bucket,key);
            if(err){
              fail(err);
            }else{
              console.log("unziping",bucket,key);
              zlib.gunzip(obj.Body,function(err,body){
                console.log("unziped",bucket,key);
                ok(body.toString());
              });
            }
          });
      })
      return p;
    }catch(ex){
      console.log(ex);
    }
   //   console.log(data);
   //  });
  }
};