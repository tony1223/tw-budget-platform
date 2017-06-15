
import Promise from "bluebird";


export default {
  _load:false,
  _promise:null,
  init(){
    if(this._load == false){
      this._promise = new Promise((ok,fail)=>{
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '1627190850901644',
            xfbml      : true,
            version    : 'v2.4'
          });
          ok(FB);
        };
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.4&appId=1627190850901644";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      });
      this._load = true;
    }
    return this._promise;
  },
  parse(dom){
    return this.init().then(FB=>{
      var p = new Promise((ok,fail) => {
        FB.XFBML.parse(dom,()=> ok(FB));
      });
      return p;
      
    });
  }
};