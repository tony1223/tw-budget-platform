import unitconverter from "./unitconverter.jsx";

export default {
  refine(comment){
    if(comment == null){
      return "";
    }
    comment = comment.replace(/[　]+/g,"");
    var html = "<div style='line-height:150%;font-size:16px;'>"+comment+"</div>";
    html = html.replace(/[0-9]+\./gi, (str) => {return "<br />"+str });
    html = html.replace(/[一二三四五六七八九十]+、/gi, (str) => {return "<br />"+str });
    html = html.replace(/\([0-9]+\)/gi, (str) => { return "<br />&nbsp;&nbsp;&nbsp;"+str } );
    html = html.replace(/增列/gi, (str) => { return  "<span style='color:#00DD00;'>"+str+"</span>" });
    html = html.replace(/減列/gi, (str) => { return  "<span style='color:pink;'>"+str+"</span>"  });
    html = html.replace(/[0-9,]+[ ]?[千]元/gi, this._refine_amount)
    html = html.replace(/上年度預算數/gi, (str) => { return "<b>"+str+"</b>"} );
    return html;
  },
  //TODO:review XSS issue
  _refine_amount(str){
    var amount = parseInt(str.replace(/[,千元]/gi,""),10);

    if(str.indexOf("千元") != -1){
      amount = amount * 1000;
    }
    

    if(amount > 1000000){
        return " <b >" + str + 
            ( " (約"+ unitconverter.convert(amount,null,false)+") </b> " )   
    }
    else{
        return " <b >" + str+" </b>" 
    }
  }

};
