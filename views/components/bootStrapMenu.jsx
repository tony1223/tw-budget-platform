var React = require('react');
var util = require("../helpers/util");
var cx = require("classnames");

var BootStrapMenu = React.createClass({
  render:function(){
    var datas = this.props.items;

    var navs = [];

    var comp = this;
    util.each(datas,function(d){
      if(d.childs){
        navs.push(
          <li className={cx({dropdown:1,active:comp.props.nav == d.key})} >
            <a href={d.url} className="dropdown-toggle" 
              data-toggle="dropdown" 
              role="button" aria-expanded="false">{d.label} <span className="caret" /></a>
            <ul className="dropdown-menu" role="menu">
              {d.childs.map(function(c){
                return <li key={c.url}><a href={c.url}>{c.label}</a></li>;
              })}
            </ul>
          </li>
        );
      }else{
        navs.push(
          <li className={cx({active:comp.props.nav == d.key})} >
            <a href={d.url}>{d.label}</a>
          </li>
        );
      }
    });


    return (
      <div>
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">{this.props.name}</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            {navs}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = BootStrapMenu;