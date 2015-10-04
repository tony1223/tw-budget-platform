
import Promise from 'promise';
var express = require('express');
var router = express.Router();

import BudgetModel from '../model/budgetmodel.jsx';


// var db = {
//   getData:function(id){
//     if(id == 3 ){
//       var data = {};
//       data.id = 3;
//       data.unit ='台北市';
//       data.title = data.unit + ' 2016 總預算';
//       data.ogimage ='http://tpebudget.tonyq.org/img/ogimage.png';
//       data.description = '快來瞭解台北市 2016 年預算類型、內容！';

//       data.budgets = [ // first is latest
//         "https://cdn.rawgit.com/tony1223/6a3bee53b175b2d4429f/raw/5e6cffa9d2d6bed87401156c66d3424952a7bf9e/gistfile1.txt",
//         "https://api.myjson.com/bins/1vyte"
//       ];
//       return Promise.resolve(data);
//     }
//     return Promise.resolve(null);
//   }
// }

/* GET home page. */
router.get('/', function(req, res, next) {

  BudgetModel.getAll(1,20).then(function(budgets){
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
        budget_id:data.id
      }
    });
  });
});


router.get('/bubble/:id', function(req, res, next) {
  var budget = req.params.id;
  BudgetModel.get(budget).then(function(data){
    res.render('dispatch.jsx', 
    { 
      comp:'bubble',
      layout:'front',
      nav:"home",
      budget_id:budget,
      pageInfo:data,
      views:{
        budget_links:data.budgets,
        budget_id:data.id
      }
    });
  });

});


router.get('/table/:id/:type?', function(req, res, next) {
  var budget = req.params.id;
  console.log("type",req.params.type);

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
        budget_id:data.id
      }
    });
  });
});


module.exports = router;


