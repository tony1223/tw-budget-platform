
import Promise from 'promise';
var express = require('express');
var router = express.Router();

import Config from "../config";


var BudgetModel = null,_BudgetModel= null,_BudgetFileModel = null;
if(!Config.file_model){
  _BudgetModel = require('../model/budgetmodel.jsx');
}else{
  _BudgetFileModel = require('../model/budgetfilemodel.jsx');
}
BudgetModel = Config.file_model ? _BudgetFileModel : _BudgetModel;

import config from "../config.js";

var fs = require("fs");

var multer  = require('multer');
var upload = multer({ dest: '/tmp/' });


/* GET home page. */
router.get('/', function(req, res, next) {

  BudgetModel.getAll(1,1000).then(function(budgets){
    res.render('dispatch.jsx', 
    { 
      comp:'index',
      layout:'default',
      nav:"home",
      pageInfo:{
        title:"預算視覺化產生器",
        "ogimage":"",
        description:"迅速產生預算視覺化",
      },
      views:{
        default_view:Config.default_view=="drilldown" ? "bubble":"drilldown",
        budgets:budgets
      }
    });
  })
 
});


router.get('/drilldown/:id', function(req, res, next) {
  var budget = req.params.id;
  BudgetModel.get(budget).then(function(data){
    res.render('dispatch.jsx', 
    { 
      comp:'drilldown',
      layout:'front',
      nav:"home",
      budget_id:budget,
      pageInfo:data,
      views:{
        budget_links:data.budgets,
        budget_id:data.id,
        budget_file_type:data.budget_file_type,
        budget_meta_links:data.meta_links
      }
    });
  });
});


router.get('/bubble/:id', function(req, res, next) {
  var budget = req.params.id;
  BudgetModel.get(budget).then(function(data){

    res.render('dispatch.jsx', 
    { 
      comp: data.budget_file_type == "2" ? 'bubble-gov': 'bubble',
      layout:'front',
      nav:"home",
      budget_id:budget,
      pageInfo:data,
      views:{
        budget_links:data.budgets,
        budget_id:data.id,
        budget_file_type:data.budget_file_type,
        budget_meta_links:data.meta_links

      }
    });
  });
});


router.get('/bubble-test', function(req, res, next) {
  var budget = req.query.file;
  var budget_type = req.query.type || 0;

  res.render('dispatch.jsx', 
  { 
    comp:'bubble',
    layout:'front',
    nav:"home",
    budget_id:-1,
    pageInfo:{},
    views:{
      budget_links:[budget],
      budget_id:-1,
      budget_file_type:budget_type
    }
  });
});


router.get('/radar-test', function(req, res, next) {

  res.render('dispatch.jsx', 
  { 
    comp:'radar',
    layout:'front',
    nav:"home",
    budget_id:-1,
    pageInfo:{},
    views:{
    }
  });
});


router.get('/table/:id/:type?', function(req, res, next) {
  var budget = req.params.id;
  // console.log("type",req.params.type);

  var allowType = {'all':1,'topname':1,'depname':1,'category':1};
  if(req.params.type != null && allowType[req.params.type] == null){
    return next();
  }

  BudgetModel.get(budget).then(function(data){
    res.render('dispatch.jsx', 
    { 
      comp:'table',
      layout:'front',
      nav:"home",
      pageInfo:data,
      views:{
        _subnav:req.params.type || 'all',
        budget_links:data.budgets,
        budget_id:data.id,
        budget_file_type:data.budget_file_type,
        budget_meta_links:data.meta_links
      }
    });
  });
});




router.get('/upload', function(req, res, next) {
  res.render('dispatch.jsx', 
  { 
    comp:'upload',
    layout:'default',
    nav:"upload",
    pageInfo:{
      title:"預算視覺化平台"
    },
    views:{
    }
  });

});



router.post('/uploading', upload.single('file'), function(req, res, next) {
  console.log(req.file);
// { fieldname: 'file',
//   originalname: 'testbudget.csv',
//   encoding: '7bit',
//   mimetype: 'text/csv',
//   destination: '/tmp/',
//   filename: '50409340425fbf2c839cfbd03da84463',
//   path: '/tmp/50409340425fbf2c839cfbd03da84463',
//   size: 38961 }
  var content = fs.readFileSync(req.file.path).toString();

  console.log(content);
  
});


module.exports = router;


