var Promise = require("promise");
import d3 from "d3";
import CommentHelper from "./comment.jsx";


var util = {
  base_url:function(str){
    if(str && str[0] == "/"){
      return str;
    }
    return "/"+str;
  },
  site_url:function(str){
    if(str && str[0] == "/"){
      return str;
    }
    return "/"+str;
  },
  asset_url:function(str){
    if(str && str[0] == "/"){
      return str;
    }
    return "/"+str;
  },
  format_date:function(d){
    var pad = function(num){
      if(num < 10){
        return "0"+num;
      }
      return num;
    };
    if(!isNaN(d)){
      d= new Date(d);
    }
    if(d.getTime){ //date
      return d.getFullYear()+"/"+ pad(d.getMonth()+1) 
        +"/" + pad(d.getDate())
        +" "+pad(d.getHours())
        +":"+pad(d.getMinutes())
        +":"+pad(d.getSeconds());
    }
  },
  watch:function(label){
    return function(d){
      console.log(label,d);
      return Promise.resolve(d);
    };
  },
  //analyticProvider.get_last_comment(null,1,200).then(function(comments){
  timeout:function(promise,time,timeout){
    var p = new Promise(function(ok,fail){
      var flag = false ,resolved = false;
      promise.then(function(datas){
        if(!resolved) {
          ok(datas);
        }
        flag = true;
      },fail);
      setTimeout(function(){
        if(!flag){
          resolved = true;
          timeout(ok);
        }
      },time);
    });
    return p;
  },
  requestJSONs(urls){

    if(global.window){
      if(urls == null || ! urls.length ){
        return Promise.resolve([]);
      }
      var promises = urls.map((url)=>{
        var p = new Promise((ok,fail)=>{
          $.get(url).then(function(body){
            var _body = body;
            if(body != null && typeof body =="string"){
              _body = JSON.parse(body);
            }

            ok(_body);

          });
        });
        return p;
      });

      return Promise.all(promises);
    }

    throw "client only";
  },
  request_csv(url,transform){
    if(global.window){
      return new Promise((ok,fail)=>{
        d3.csv(url, transform || ((d)=>d), function(error, rows) {
          if(error){
            fail("fail to parse:"+url);
          }
          else{
            ok(rows);
          }
        });
      });
      
    }
    throw "client only";

  },
  each:function(ary,cb){
    if(ary == null){
      return true;
    }
    if(ary.forEach){
      ary.forEach(cb);
    }else{
      for(var i = 0; i < ary.length;++i){
        if(cb){ 
          var r = cb(ary[i],i);
          if(r === false){
            break;
          }
        }
      }
    }
  },
  combine:function(arrs){
    var out = [];
    this.each(arrs,function(){
      out.push.apply(out,ary);
    });
    return ary;
  },
  err:function(){
    return function(){
      console.log("fail:",message);
      console.log(arguments);
    };
  },
  getBudgetInfos_v0_default_json(budget_file_type,budget_links){

    return this.requestJSONs(budget_links).then((datas)=>{
      var res = datas[0];
      if(res.length && datas.length > 1 && res[0].last_amount == null){
        var map = {};
        datas[1].forEach((data)=>{ map[data.code] = data.amount; });

        res.forEach((r) => {
          r.last_amount = parseInt(map[r.code] || 0,10);
          r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
          r.comment = CommentHelper.refine(r.comment);
        });
      }else{
        res.forEach((r) => {
          r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
          r.comment = CommentHelper.refine(r.comment);
        });
      }
      return res;
    });
  },
  parseFormalNumbers(num){
    return parseInt(num.replace(/,/g,""),10);
  },
  refine_amount(num){
    return CommentHelper._refine_amount(num);
  },
  getBudgetInfos_v1_header_csv(budget_file_type,budget_links){

    var map = {};

    var codeFn = function(items){
      var out =[];
      items.forEach(function(step){
        if(!(step == "0" || step  == ""|| step  == null)){
          out.push(step);
        }
      });

      return out.join("-");

    };
    return this.request_csv(budget_links[0],(data)=>{
      var steps = [data["款"] ,data["項"] ,data["目"],data["節"]];
      var code = codeFn(steps);
      map[code] = data["名稱"];

      if(data["節"] == "0" || data["節"]  == ""|| data["節"]  == null){
        return null;
      }
      var result = {
        // "year": 2016,
        "code":  code,
        "last_amount":this.parseFormalNumbers(data["上年度預算數"]) ,
        "amount": this.parseFormalNumbers(data["本年度預算數"]),
        "name": data["名稱"],
        "topname": map[codeFn(steps.slice(0,1))],
        "depname": map[codeFn(steps.slice(0,2))],
        "depcat": map[codeFn(steps.slice(0,3))],
        "category": map[codeFn(steps.slice(0,3))],
        "cat": map[codeFn(steps.slice(0,1))],
        "ref": code,
        "comment": CommentHelper.refine(data["說明"]),
        "change": this.parseFormalNumbers(data["本年度預算數"]) - this.parseFormalNumbers(data["上年度預算數"]) 
      };
      return result;
    }).then((items) => items.filter(n=>n!=null));
  },
  process_meta_link:function(meta_links){
    if(meta_links == null){
      return Promise.resolve({});
    }

    var results = {};
    var promises = Object.keys(meta_links).map((key) =>{
      return this.requestJSONs([meta_links[key]]).then(([data])=>{
        if(key == "purpose"){ //用途別
          data.Root.Row.forEach(function(item){
            results[item["預算科目編號"]] = results[item["預算科目編號"]]||{};
            results[item["預算科目編號"]]["purpose"] = item;
          });
        }
      });
    });
    return Promise.all(promises).then(function(){
      return results;
    });
  },
  getBudgetInfos(budget_file_type,budget_links){


    if(budget_file_type =="1"){
      return this.getBudgetInfos_v1_header_csv(budget_file_type,budget_links);
    }
    // if(budget_file_type == null || budget_file_type == 0){
    return this.getBudgetInfos_v0_default_json(budget_file_type,budget_links);
    // }
    
  }
  
};

module.exports = util;