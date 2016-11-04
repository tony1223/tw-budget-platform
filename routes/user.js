var express = require('express');
var router = express.Router();

import UserModel from '../model/usermodel.jsx';

router.get('/signup', function(req, res, next) {

  res.render('dispatch.jsx', 
  { 
    comp:'user/signup',
    layout:'default',
    nav:"home",
    pageInfo:{
      title:"預算視覺化產生器 - 註冊"
    },
    views:{
    }
  }); 
});



router.post('/signuping', function(req, res, next) {
  var account = req.body.account ;
  var pwd = req.body.account ;

  console.log(req.body);
  if(account == null || pwd == null || account.trim() =="" || pwd.trim() == ""){
    res.send({ok:false,errorMessage:"帳號或密碼為空"});
    return true;
  }

  UserModel.get(account,pwd).then((u)=>{
    if(u != null){
      req.session._u = u;
      res.send({ok:true,u:u});
      return true;
    }

    
    UserModel.insert(account,pwd).then((u)=>{
      res.send({ok:true,u:u,create:true});   
    },(err) => {
      if(err.code == '23505'){
        res.send({ok:false,errorMessage:"密碼錯誤"});
        return true;
      }
      res.send({ok:false,errorMessage:"未知的錯誤"});
      
    });
  })

});




module.exports = router;
