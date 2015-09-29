
import Promise from 'promise';
var express = require('express');
var router = express.Router();

var db = {
  getData:function(id){
    if(id == 3 ){
      var data = {};
      data.id = 3;
      data.unit ='台北市';
      data.title = data.unit + ' 2016 總預算';
      data.ogimage ='http://tpebudget.tonyq.org/img/ogimage.png';
      data.description = '快來瞭解台北市 2016 年預算類型、內容！';

      data.budgets = [ // first is latest
        "https://cdn.rawgit.com/tony1223/6a3bee53b175b2d4429f/raw/5e6cffa9d2d6bed87401156c66d3424952a7bf9e/gistfile1.txt",
        "https://api.myjson.com/bins/1vyte"
      ];
      return Promise.resolve(data);
    }
    return Promise.resolve(null);
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {};
  data.id = 0;
  data.unit ='台北市';
  data.title = data.unit + ' 2016 總預算';
  data.ogimage ='http://tpebudget.tonyq.org/img/ogimage.png';
  data.description = '快來瞭解台北市 2016 年預算類型、內容！';

  res.render('dispatch.jsx', 
  { 
    comp:'index',
    title:"測試用",
    layout:'front',
    nav:"home",
    pageInfo:data,
    react:{
      budget_links:data.budgets,
      budget_id:data.id
    }
  });
});

router.get('/drilldown/:id', function(req, res, next) {
  var budget = req.params.id;
  db.getData(3).then(function(data){
    res.render('dispatch.jsx', 
    { 
      comp:'drilldown',
      title:"測試用",
      layout:'front',
      nav:"home",
      pageInfo:data,
      react:{
        budget_links:data.budgets,
        budget_id:data.id
      }
    });
  });

});

router.get('/table/:id', function(req, res, next) {
  var budget = req.params.id;

  db.getData(3).then(function(data){
    res.render('dispatch.jsx', 
    { 
      comp:'table',
      title:"測試用",
      layout:'front',
      nav:"home",
      pageInfo:data,
      react:{
        budget_links:data.budgets,
        budget_id:data.id
      }
    });
  });
});

module.exports = router;


