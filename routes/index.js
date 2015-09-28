var express = require('express');
var router = express.Router();

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
    pageInfo:data
  });
});

router.get('/drilldown/:id', function(req, res, next) {
  var budget = req.params.id;
  var data = {};
  if(budget == 3){
    data.id = budget;
    data.unit ='台北市';
    data.title = data.unit + ' 2016 總預算';
    data.ogimage ='http://tpebudget.tonyq.org/img/ogimage.png';
    data.description = '快來瞭解台北市 2016 年預算類型、內容！';
  }
  res.render('dispatch.jsx', 
  { 
    comp:'drilldown',
    title:"測試用",
    layout:'front',
    nav:"home",
    pageInfo:data
  });
});

module.exports = router;


