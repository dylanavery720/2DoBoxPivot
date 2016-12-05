const $ = require("jquery");
import * as globalVars from "./globalVars";
import {storageArray} from "./storage";
import {newTask} from "./taskLoader";

export const mainFunction = (obj) => {
  newTask(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

export const displayedIdCheck = () => {
  let displayedTasksArray = $(".task-box");
  let displayedTasksIds = [];

  displayedTasksArray.each((i) => {
    if($(displayedTasksArray[i]).prop("class") === "task-box completed-task"){
      displayedTasksIds.push($(displayedTasksArray[i]).prop("id"));
    }
  });

  return displayedTasksIds;
}

export const filterCheckboxList = () => {
  const checkboxCheck = $(".filter-buttons-container").children("label");
  let filterArray = [];

  checkboxCheck.each((e) => {
    if($(checkboxCheck[e]).children().is(":checked")){
      filterArray.push($(checkboxCheck[e]).text());
    }
  })
  return filterArray;
}

export const filteredArrayList = () => {
  const filterArray = filterCheckboxList();
  const storedObjArray = storageArray();
  let arrayToDisplay = [];

  filterArray.forEach((e) => {
    storedObjArray.forEach((i) => {
      if(e === i.importance && !i.completed){
        arrayToDisplay.push(i)
      }
    })
  })

  return arrayToDisplay;
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

export const getIncompleteTasks = (storedObjArray) => {
  let incompleteTasks = [];

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  });
  return incompleteTasks;
}


export const completeButtonToggle = () => {
  if(globalVars.showCompleteBtnToggle){
    globalVars.showCompleteBtnToggle = false;
    $("#show-completed-button").text("Show Completed 2Do's");
  } else {
    globalVars.showCompleteBtnToggle = true;
    $("#show-completed-button").text("Hide Completed 2Do's");
  }
}
