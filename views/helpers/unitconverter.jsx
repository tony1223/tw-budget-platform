

class UnitMapper{

  constructor(){
    this.unit = 0;
    this.callbacks = [];
    this.table = [
      ["", '元', 1], 
      ['份', '營養午餐', '25'], ['人的', '年薪', '308000'], 
      ['分鐘', '太空旅遊', '1000000'], ['碗', '鬍鬚張魯肉飯', '68'], 
      ['個', '便當', '50'], 
      ['杯', '珍奶', '30'], 
      ['份', '雞排加珍奶', '60'], 
      ['座', '冰島', '2000080000000'], 
      ['支', 'iPhone5', '25900'], 
      ['次', '北市重陽敬老禮金', '770000000']
    ];
  }

  random(){
    return this.unit = parseInt(Math.random() * this.table.length);
  }

  get(){
    return this.unit;
  }

  getUnit(des_unit){
    des_unit == null && (des_unit = this.unit);
    return this.table[des_unit][1];
  }

  getQuantifier(des_unit){
    des_unit == null && (des_unit = this.unit);
    return this.table[des_unit][0];
  }

  _num(val, divide, floats){
    return parseInt(val / divide * Math.pow(10, 2), 10) / Math.pow(10, floats);
  }

  convert(value2, des_unit, full_desc){
    var prefix, value, unitdata;
    prefix = "";
    if (value2 < 0) {
      value = value2 * -1;
      prefix = "-";
    } else {
      value = value2;
    }
    if(des_unit == null){
      des_unit = 0 ;
    }
    if (des_unit === -1) {
      des_unit = parseInt(Math.random() * this.table.length);
    }
    des_unit == null && (des_unit = this.unit);
    unitdata = this.table[des_unit] || ["", "元", 1];
    value = parseInt(10000 * value / unitdata[2]) / 10000;
    value = value >= 1000000000000
      ? this._num(value, 1000000000000, 2) + " 兆"
      : value >= 100000000
        ? this._num(value, 100000000, 2) + " 億"
        : value >= 10000
          ? parseInt(value / 10000) + " 萬"
          : value >= 1000
            ? parseInt(value / 1000) + " 千"
            : value >= 1 ? parseInt(10 * value) / 10 : value;
    return prefix + value + (full_desc ? unitdata[0] + unitdata[1] : "");
  }

  onchange(func){
    return this.callbacks.push(func);
  }

  percent(part,sum){
    if(sum == 0){
      return "100%";
    }
    
    var p = (parseInt( (part/sum) *100 * 100,10)/100);

    return (p > 0 ? "+"+p:p)+"%";
  }

  _percent(part,sum){
    if(sum == 0){
      return 1;
    }
    return (part/sum);
  }

  update(idx){
    if (this.unit >= 0) {
      $('#unit-selector li:eq(' + this.unit + ') ').removeClass('active');
    }
    this.unit = idx === -1
      ? parseInt(Math.random() * this.table.length)
      : idx === void 8 ? 0 : idx;
    $('#unit-selector li:eq(' + this.unit + ')').addClass('active');
    d3.selectAll('text.amount').text((d) =>{
      return this.convert(d.size || d.value.sum, this.unit, true);
    });

    var that = this;
    jQuery.each($(".unit-convert"), function(){
      return $(this).text(that.convert($(this).attr("cc-value"), that.unit, true));
    });
    return jQuery.each(this.callbacks, function(x){
      return this();
    });
  }

  init(){}
}

export default new UnitMapper();

