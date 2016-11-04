

import budgets from "../budget_list.js";
import Proimse from "bluebird";

//       </DefaultLayout>

class BudgetModel{

  getAll(page,pageSize){
    return Promise.resolve(budgets);
  }

  get(ind){
    var filted = budgets.filter((b)=> b.id == ind);
    if(filted.length == 0){
      return Promise.resolve(null);
    }
    return Promise.resolve(filted[0]);
  }
}

export default new BudgetModel();