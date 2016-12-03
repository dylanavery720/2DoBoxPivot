require('../css/reset.scss');
require('../css/main.scss');

const $ = require("jquery");
import {storageArray} from "./storage";
import {loadTopTenTasks} from "./taskLoader";
import {sortArray} from "./miscFunctions";


$(document).ready(() => {
  let incompleteTasks = [];
  let storedObjArray = storageArray();

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  })

  loadTopTenTasks(sortArray(incompleteTasks));
  $('#save-button').prop('disabled', true);
});
