const $ = require("jquery");
import * as globalVars from "./globalVars";
import {newTask} from "./taskLoader";

export const mainFunction = (obj) => {
  newTask(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

const displayedCheck = () => {
  let displayedTasksArray = $(".task-box");
  let displayedTasksIds = [];

  displayedTasksArray.each((i) => {
    if($(displayedTasksArray[i]).prop("class") === "task-box completed-task"){
      displayedTasksIds.push($(displayedTasksArray[i]).prop("id"));
    }
  });

  return displayedTasksIds;
}

export const inputCheck = () => {
  return /\S/.test(globalVars.$title.val()) && /\S/.test(globalVars.$body.val());
}

const clearFields = () => {
  globalVars.$title.val('');
  globalVars.$body.val('');
  $('#save-button').prop('disabled', true);
}

export const sortArray = (taskArray) => {
  taskArray.sort((a, b) => {
    return b.id - a.id;
  });
  return taskArray;
}

const getIncompleteTasks = (storedObjArray) => {
  let incompleteTasks = [];

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  });
  return incompleteTasks;
}
