import React from "react";
import BaseComponent from './../components/BaseComponent.jsx';


export default class Index extends BaseComponent {
  render(){
    return (
      <div>
        <h1>上傳新的預算視覺化</h1>
        
        <p>請上傳對應的 csv 檔(UTF-8 編碼)，格式欄位請參考 
          <a target="_blank" href="https://docs.google.com/spreadsheets/d/1QijXNn1dLGgXnN__qPFZrBqO1yfFlSOTDCA2wShKDJQ/edit">範例檔案</a>。
        </p>
        <form action="/uploading" encType='multipart/form-data' method="post">
          <br />
          <input type="file" name="file" />
          <br />
          <button className="btn btn-primary">送出</button>
        </form>
      </div>
    );
  }
}

