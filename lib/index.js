const $ = require("jquery");
import {mainFunction, displayedCheck, clearFields, sortArray, getIncompleteTasks} from "miscFunctions";


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
