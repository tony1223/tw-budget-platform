

import pg from './pg.jsx';

//       </DefaultLayout>

class BudgetModel{

  getAll(page,pageSize){
    return pg.then(function([db,queryResult]){
      return db.query("select * from budget limit ${pageSize} offset ${offset}",
        {pageSize:pageSize,offset:(page-1) * pageSize});
      // db.queryResult
    });
  }

  get(ind){
    return pg.then(function([db,queryResult]){
      return db.query("select * from budget where id = ${id} ",{id:ind},queryResult.ONE);
      // db.queryResult
    });
  }
}

export default new BudgetModel();