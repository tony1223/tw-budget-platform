var Promise = require("promise");

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
	profile_url:function(userkey){
		if(userkey.indexOf("id=") != -1){
			return "http://facebook.com/profile.php?"+userkey;
		}
		return "http://facebook.com/"+userkey;
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
		}
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
	comment_status:function(statusCode){
	    var status = null;
	    switch(statusCode){ 
	        case 0: status = "待確認";break;
	        case -1: status = "一般留言";break;
	        case 1: status = "跳針";break;
	        case 2: status = "沒問題";break;
	    }
	    return status;
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
	}
};

module.exports = util;