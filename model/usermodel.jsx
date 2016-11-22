
import sha1 from 'sha1';
import pg from './pg.jsx';
import config from '../config';

var salt = config.salt;

class UserModel{

  insert(account,pwd){
    return pg.then(function([db,queryResult]){
      return db.query("insert into \"user\"(account,pwd) values(${account},${pwd}) returning account,id ",
        {
          account:account,
          pwd:sha1(pwd + salt)
        },
        queryResult.ONE);
      // db.queryResult
    });
  }
  checkAccount(account){
    return pg.then(function([db,queryResult]){
      return db.query("select * from \"user\" where account = ${account} ",
        {
          account:account,
        },queryResult.ONE);
      // db.queryResult
    });
  }
  get(account,pwd){
    return pg.then(function([db,queryResult]){
      return db.query("select * from \"user\" where account = ${account} and pwd = ${pwd} ",
        {
          account:account,
          pwd:sha1(pwd + salt)
        },queryResult.ONE);
      // db.queryResult
    });
  }
}

export default new UserModel();