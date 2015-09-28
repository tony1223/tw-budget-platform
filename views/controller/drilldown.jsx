
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTreeMap from './../components/d3BudgetTreemap.jsx';

import sample from './../helpers/sampledata.jsx';




export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data:{"drilldown":[{"depname":"市議會","amount":812700799,"num_entries":7,"cat":"市議會主管"},{"depname":"秘書處","amount":298203926,"num_entries":9,"cat":"市政府主管"},{"depname":"市政大樓公共事務管理中","amount":407994672,"num_entries":6,"cat":"市政府主管"},{"depname":"主計處","amount":163788786,"num_entries":9,"cat":"市政府主管"},{"depname":"人事處","amount":128974354,"num_entries":9,"cat":"市政府主管"},{"depname":"政風處","amount":70981278,"num_entries":7,"cat":"市政府主管"},{"depname":"公務人員訓練處","amount":144674654,"num_entries":5,"cat":"市政府主管"},{"depname":"研究發展考核委員會","amount":196628331,"num_entries":9,"cat":"市政府主管"},{"depname":"都市計畫委員會","amount":17842161,"num_entries":4,"cat":"市政府主管"},{"depname":"原住民族事務委員會","amount":231986321,"num_entries":8,"cat":"市政府主管"},{"depname":"客家事務委員會","amount":190546765,"num_entries":6,"cat":"市政府主管"},{"depname":"松山區公所","amount":224213180,"num_entries":9,"cat":"市政府主管"},{"depname":"信義區公所","amount":231606863,"num_entries":8,"cat":"市政府主管"},{"depname":"大安區公所","amount":253647323,"num_entries":8,"cat":"市政府主管"},{"depname":"中山區公所","amount":239732533,"num_entries":8,"cat":"市政府主管"},{"depname":"中正區公所","amount":206057425,"num_entries":8,"cat":"市政府主管"},{"depname":"大同區公所","amount":167901264,"num_entries":8,"cat":"市政府主管"},{"depname":"萬華區公所","amount":223616395,"num_entries":8,"cat":"市政府主管"},{"depname":"文山區公所","amount":239623496,"num_entries":9,"cat":"市政府主管"},{"depname":"南港區公所","amount":153120127,"num_entries":8,"cat":"市政府主管"},{"depname":"內湖區公所","amount":231402292,"num_entries":8,"cat":"市政府主管"},{"depname":"士林區公所","amount":255883600,"num_entries":8,"cat":"市政府主管"},{"depname":"北投區公所","amount":229544514,"num_entries":8,"cat":"市政府主管"},{"depname":"民政局","amount":1063646095,"num_entries":11,"cat":"民政局主管"},{"depname":"孔廟管理委員會","amount":36290595,"num_entries":5,"cat":"民政局主管"},{"depname":"殯葬管理處","amount":914294104,"num_entries":7,"cat":"民政局主管"},{"depname":"松山區戶政事務所","amount":63003960,"num_entries":4,"cat":"民政局主管"},{"depname":"信義區戶政事務所","amount":68986812,"num_entries":4,"cat":"民政局主管"},{"depname":"大安區戶政事務所","amount":93158103,"num_entries":3,"cat":"民政局主管"},{"depname":"中山區戶政事務所","amount":70388900,"num_entries":4,"cat":"民政局主管"},{"depname":"中正區戶政事務所","amount":80984847,"num_entries":4,"cat":"民政局主管"},{"depname":"大同區戶政事務所","amount":47779247,"num_entries":4,"cat":"民政局主管"},{"depname":"南港區戶政事務所","amount":39091950,"num_entries":4,"cat":"民政局主管"},{"depname":"內湖區戶政事務所","amount":62755012,"num_entries":4,"cat":"民政局主管"},{"depname":"士林區戶政事務所","amount":77209834,"num_entries":3,"cat":"民政局主管"},{"depname":"北投區戶政事務所","amount":63803410,"num_entries":3,"cat":"民政局主管"},{"depname":"萬華區戶政事務所","amount":65088482,"num_entries":4,"cat":"民政局主管"},{"depname":"文山區戶政事務所","amount":77998333,"num_entries":4,"cat":"民政局主管"},{"depname":"財政局","amount":3042371410,"num_entries":10,"cat":"財政局主管"},{"depname":"稅捐稽徵處","amount":926257316,"num_entries":10,"cat":"財政局主管"},{"depname":"教育局","amount":52721368415,"num_entries":4,"cat":"教育局主管"},{"depname":"市立圖書館","amount":657538884,"num_entries":10,"cat":"教育局主管"},{"depname":"市立動物園","amount":666511150,"num_entries":10,"cat":"教育局主管"},{"depname":"市立天文科學教育館","amount":216850247,"num_entries":7,"cat":"教育局主管"},{"depname":"家庭教育中心","amount":28413856,"num_entries":3,"cat":"教育局主管"},{"depname":"青少年發展處","amount":154377131,"num_entries":7,"cat":"教育局主管"},{"depname":"產業發展局","amount":652069908,"num_entries":12,"cat":"產業發展局主管"},{"depname":"動物保護處","amount":200227725,"num_entries":7,"cat":"產業發展局主管"},{"depname":"市場處","amount":910015298,"num_entries":6,"cat":"產業發展局主管"},{"depname":"商業處","amount":197429251,"num_entries":7,"cat":"產業發展局主管"},{"depname":"工務局","amount":1684770452,"num_entries":6,"cat":"工務局主管"},{"depname":"水利工程處","amount":2632357657,"num_entries":7,"cat":"工務局主管"},{"depname":"新建工程處","amount":4667389361,"num_entries":6,"cat":"工務局主管"},{"depname":"公園路燈工程管理處","amount":3654924776,"num_entries":8,"cat":"工務局主管"},{"depname":"衛生下水道工程處","amount":2816297632,"num_entries":10,"cat":"工務局主管"},{"depname":"大地工程處","amount":921554696,"num_entries":8,"cat":"工務局主管"},{"depname":"交通局","amount":450267987,"num_entries":11,"cat":"交通局主管"},{"depname":"停車管理工程處","amount":97978142,"num_entries":5,"cat":"交通局主管"},{"depname":"交通管制工程處","amount":645873471,"num_entries":8,"cat":"交通局主管"},{"depname":"公共運輸處","amount":4702299214,"num_entries":13,"cat":"交通局主管"},{"depname":"交通事件裁決所","amount":213347433,"num_entries":10,"cat":"交通局主管"},{"depname":"社會局","amount":13903634468,"num_entries":18,"cat":"社會局主管"},{"depname":"陽明教養院","amount":299507173,"num_entries":5,"cat":"社會局主管"},{"depname":"浩然敬老院","amount":254187491,"num_entries":7,"cat":"社會局主管"},{"depname":"家庭暴力暨性侵害防治中","amount":290790001,"num_entries":4,"cat":"社會局主管"},{"depname":"勞動局","amount":4799834926,"num_entries":9,"cat":"勞動局主管"},{"depname":"就業服務處","amount":160825731,"num_entries":7,"cat":"勞動局主管"},{"depname":"職能發展學院","amount":206701511,"num_entries":5,"cat":"勞動局主管"},{"depname":"勞動檢查處","amount":127031948,"num_entries":6,"cat":"勞動局主管"},{"depname":"勞動力重建運用處","amount":66133062,"num_entries":5,"cat":"勞動局主管"},{"depname":"警察局","amount":13500971028,"num_entries":13,"cat":"警察局主管"},{"depname":"衛生局","amount":4566121744,"num_entries":12,"cat":"衛生局主管"},{"depname":"松山區健康服務中心","amount":36199092,"num_entries":4,"cat":"衛生局主管"},{"depname":"信義區健康服務中心","amount":39807246,"num_entries":4,"cat":"衛生局主管"},{"depname":"大安區健康服務中心","amount":44671160,"num_entries":4,"cat":"衛生局主管"},{"depname":"中山區健康服務中心","amount":35176296,"num_entries":4,"cat":"衛生局主管"},{"depname":"中正區健康服務中心","amount":29878510,"num_entries":4,"cat":"衛生局主管"},{"depname":"大同區健康服務中心","amount":27452496,"num_entries":3,"cat":"衛生局主管"},{"depname":"萬華區健康服務中心","amount":41599593,"num_entries":4,"cat":"衛生局主管"},{"depname":"文山區健康服務中心","amount":45869700,"num_entries":4,"cat":"衛生局主管"},{"depname":"南港區健康服務中心","amount":27079156,"num_entries":3,"cat":"衛生局主管"},{"depname":"內湖區健康服務中心","amount":38111766,"num_entries":4,"cat":"衛生局主管"},{"depname":"士林區健康服務中心","amount":41206769,"num_entries":3,"cat":"衛生局主管"},{"depname":"北投區健康服務中心","amount":35027018,"num_entries":4,"cat":"衛生局主管"},{"depname":"環境保護局","amount":5662676375,"num_entries":16,"cat":"環境保護局主管"},{"depname":"衛生稽查大隊","amount":233525959,"num_entries":5,"cat":"環境保護局主管"},{"depname":"內湖垃圾焚化廠","amount":252848491,"num_entries":5,"cat":"環境保護局主管"},{"depname":"木柵垃圾焚化廠","amount":252754246,"num_entries":4,"cat":"環境保護局主管"},{"depname":"北投垃圾焚化廠","amount":373349137,"num_entries":5,"cat":"環境保護局主管"},{"depname":"都市發展局","amount":2795202875,"num_entries":9,"cat":"都市發展局主管"},{"depname":"都市更新處","amount":125535846,"num_entries":5,"cat":"都市發展局主管"},{"depname":"建築管理工程處","amount":579511949,"num_entries":5,"cat":"都市發展局主管"},{"depname":"文化局","amount":1823338430,"num_entries":12,"cat":"文化局主管"},{"depname":"中山堂管理所","amount":81023167,"num_entries":4,"cat":"文化局主管"},{"depname":"文獻委員會","amount":43939676,"num_entries":7,"cat":"文化局主管"},{"depname":"市立美術館","amount":390953347,"num_entries":9,"cat":"文化局主管"},{"depname":"市立交響樂團","amount":231317422,"num_entries":5,"cat":"文化局主管"},{"depname":"市立國樂團","amount":169440873,"num_entries":4,"cat":"文化局主管"},{"depname":"市立社會教育館","amount":266222063,"num_entries":5,"cat":"文化局主管"},{"depname":"消防局","amount":2882941778,"num_entries":11,"cat":"消防局主管"},{"depname":"臺北翡翠水庫管理局","amount":317225364,"num_entries":7,"cat":"臺北翡翠水庫管理局主管"},{"depname":"觀光傳播局","amount":460817579,"num_entries":12,"cat":"觀光傳播局主管"},{"depname":"臺北廣播電臺","amount":49276611,"num_entries":4,"cat":"觀光傳播局主管"},{"depname":"地政局","amount":369893432,"num_entries":5,"cat":"地政局主管"},{"depname":"土地開發總隊","amount":149591580,"num_entries":5,"cat":"地政局主管"},{"depname":"松山地政事務所","amount":123166822,"num_entries":4,"cat":"地政局主管"},{"depname":"大安地政事務所","amount":102586568,"num_entries":5,"cat":"地政局主管"},{"depname":"中山地政事務所","amount":118758524,"num_entries":5,"cat":"地政局主管"},{"depname":"古亭地政事務所","amount":98561585,"num_entries":5,"cat":"地政局主管"},{"depname":"建成地政事務所","amount":91518760,"num_entries":4,"cat":"地政局主管"},{"depname":"士林地政事務所","amount":127223488,"num_entries":4,"cat":"地政局主管"},{"depname":"兵役局","amount":205478164,"num_entries":9,"cat":"兵役局主管"},{"depname":"臺北自來水事業處","amount":218477378,"num_entries":3,"cat":"臺北自來水事業處主管"},{"depname":"體育局","amount":4469375188,"num_entries":9,"cat":"體育局主管"},{"depname":"資訊局","amount":593871787,"num_entries":6,"cat":"資訊局主管"},{"depname":"法務局","amount":151383341,"num_entries":9,"cat":"法務局主管"},{"depname":"捷運工程局","amount":10000,"num_entries":2,"cat":"捷運工程局主管"},{"depname":"公務人員退休及撫卹給付","amount":5187898417,"num_entries":1,"cat":"其他支出"},{"depname":"公務人員福利互助補助","amount":666366359,"num_entries":1,"cat":"其他支出"},{"depname":"國家賠償金","amount":35000000,"num_entries":1,"cat":"其他支出"},{"depname":"公務人員(工)待遇準備","amount":300000000,"num_entries":1,"cat":"其他支出"},{"depname":"災害準備金","amount":700000000,"num_entries":1,"cat":"其他支出"},{"depname":"第二預備金","amount":1500000000,"num_entries":1,"cat":"第二預備金"}],"summary":{"pagesize":1000000,"cached":true,"num_entries":781,"page":1,"currency":{"amount":"TWD"},"amount":161824522621,"cache_key":"8311c0ab057432fb04ac54847f5fc214e24c69cd","pages":1}},
      selectedDrill:{"depname":"市議會","amount":812700799,"num_entries":7,"cat":"市議會主管"},

      sampleData: sample.bubble,
      domain: {x: [0, 30], y: [0, 100]}
    };
  }
  
  doFocusDrill(drill){
    this.setState({selectedDrill:drill});
  }

  componentDidMount() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart = new BudgetTreeMap(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());

  }

  componentDidUpdate() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart.update(el, this.getChartState());
  }

  getChartState() {
    return {
      data: this.state.sampleData,
      domain: this.state.domain
    };
  }

  componentWillUnmount() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart.destroy(el);
  }


  render(){
    var {data,selectedDrill} = this.state;
    var {drilldown} = data;
    return (
      <div>
        <div className='col-md-9'>
          <h1></h1>
          <div ref="chart" className="Chart"></div>

          <div>
            {drilldown.map((d)=>{
              return <p onMouseOver={this.doFocusDrill.bind(this,d)}>
                {d.cat} > {d.depname}
              </p>;
            })}
            
          </div>
        </div>
        <div className='col-md-3'>
          <p>
            <i style={{"margin-top":"2px"}} className="icon-big-info-sign"></i>
            { selectedDrill && selectedDrill.depname }
          </p>
          <p>
            <span className="budget-amount-title">
              { selectedDrill && unitconverter.convert(selectedDrill.amount,null,false) }
            </span>
          </p>
          <p> (即為{ selectedDrill && unitconverter.convert(selectedDrill.amount,-1,true) }) </p>
          <p>
            屬於 {selectedDrill && selectedDrill.cat } 項目
          </p>
        </div>
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(Index), document.getElementById("react-root"));
}

