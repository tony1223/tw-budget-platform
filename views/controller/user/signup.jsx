import React from "react";

import BaseComponent from './../../components/BaseComponent.jsx';
// import ReCAPTCHA from "react-google-recaptcha";
import ReCAPTCHA from "react-google-recaptcha";

import { Input,ButtonInput } from 'react-bootstrap';


export default class Signup extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {};
  }
  onSubmit(e){
    var account = this.refs.account.getValue();
    var pwd = this.refs.pwd.getValue();
      
    $.post("/user/signuping",{account,pwd},(res) => {
      if(res.ok){
        self.location.href = '/user/post';
        return ;
      }
      this.setState({error:res.errorMessage});
    });
    e.preventDefault();
  }

  render(){
    var errorMessage = this.state.error;
    return (
        <div>
          <h2>註冊或登入新帳號</h2>
          <form onSubmit={this.onSubmit.bind(this)}>
            
            <Input ref='account' type="text" label="請輸入帳號" 
              placeholder="請輸入帳號" />
            <Input ref='pwd' type="password" label="請輸入密碼" 
              placeholder="Enter text" />            

            {/* this.isClient() && <div className='form-group'>
              <ReCAPTCHA
                  sitekey="6Lcxj8USAAAAALtlqW54N50cZoeKdqapWL0ZSlAK" />
            </div> */}
            <ButtonInput type="submit" value="送出" />
            <br />
            {errorMessage && <div className='label label-danger'>{errorMessage}</div>}
          </form>        
        </div>
      );
  }

  static renderServerScripts(){
    return <script src="https://www.google.com/recaptcha/api.js" async defer></script>;
  }
}


if(global.window != null){
  React.render(React.createElement(Signup,window.react_data), document.getElementById("react-root"));
}
