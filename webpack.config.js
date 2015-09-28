// module.exports = require("./webpack_inner")({
//  devServer: true,
//  devtool: "eval",
//  debug: true
// });  
var devServer = false;
var hotComponents = false;
var hot = false;

var path = require("path");


var fs = require("fs");

function scan(dir){
  var files = fs.readdirSync(dir);
  var res = [];
  files.forEach(function(f){
    if(f.indexOf("js") != -1 || f.indexOf("jsx") != -1){
      res.push(dir +"/"+ f);
    }else{
      try{
        var child = scan(dir +"/"+ f);
        [].push.apply(res,child);
      }catch(ex){
        // console.log(f,ex);
      }
    }
  });
  return res;
}

var entries = {};
var views = scan("views");
views.forEach(function(v){
  if(hot){
    entries[v.replace("views/","").replace(/\.js[x]?/,"")] = ['webpack/hot/dev-server',"./"+v];
  }else{
    entries[v.replace("views/","").replace(/\.js[x]?/,"")] = ["./"+v];
  }
});


function extsToRegExp(exts) {
  return new RegExp("\\.(" + exts.map(function(ext) {
    return ext.replace(/\./g, "\\.");
  }).join("|") + ")(\\?.*)?$");
}

var loadersByExtension = function(obj) {
  var loaders = [];
  Object.keys(obj).forEach(function(key) {
    var exts = key.split("|");
    var value = obj[key];
    var entry = {
      extensions: exts,
      test: extsToRegExp(exts),
      loaders: value
    };
    if(Array.isArray(value)) {
      entry.loaders = value;
    } else if(typeof value === "string") {
      entry.loader = value;
    } else {
      Object.keys(value).forEach(function(valueKey) {
        entry[valueKey] = value[valueKey];
      });
    }
    loaders.push(entry);
  });
  return loaders;
};

var loaders = {
  "jsx": hotComponents ? ["react-hot-loader", "babel-loader?stage=0"] : "babel-loader?stage=0",
  "js": {
    loader: "babel-loader?stage=0",
    include: path.join(__dirname, "app")
  },
  "json": "json-loader",
  "json5": "json5-loader",
  "txt": "raw-loader",
  "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
  "woff|woff2": "url-loader?limit=100000",
  "ttf|eot": "file-loader",
  "wav|mp3": "file-loader",
  "less":"style!css!less?sourceMap",
  "scss":"style!css!sass?sourceMap",
  "html": "html-loader"
//    "md|markdown": ["html-loader", "markdown-loader"]
};

var publicPath = devServer ?
    "http://localhost:9091/resource/" :
    "/resource/";
var output = {
  path: path.join(__dirname, "public/resource"),
  publicPath: publicPath,
  filename: "[name].js" ,
  // chunkFilename: (devServer ? "[id].js" : "[name].js") ,
  //+ (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
  sourceMapFilename: "debugging/[file].map"
  // libraryTarget: "commonjs"
  // pathinfo: true
};

module.exports = {
  entry:entries,
  exclude:["react","react/addons"],
  module:{
    loaders:loadersByExtension(loaders)
  },
  output:output,
  externals:[
    {
      "react": "var React",
      "react/addons": "var React"
    }
  ],
  devServer: {
    proxy: {
      '*': 'http://localhost:3000'
    }
  }
  // target: "web"
}
