const $ = require("jquery");
import * as globalVars from "./globalVars";
import {sortArray, displayedIdCheck, getIncompleteTasks, filteredArrayList} from "./miscFunctions";
import "./clickEvents";
import {complete} from "./completeTask";
import {storageArray} from "./storage";

export default class NewTodo {
  constructor(id, title, body, importance = "Normal", completed = false) {
    return {id, title, body, importance, completed};
  }
}

export const newTask = (obj) => {
  $('.task-container').prepend(createTaskBox(obj));
}

const loadTask = (obj) => {
  $('.task-container').append(createTaskBox(obj));
}

const createTaskBox = (obj) => {
  return (`
    <article id=${obj.id} class='task-box'>
      <div class='flexer'>
        <button type='button' name='delete-button' class='delete-button'>DELETE</button>
          <h2 class='task-title' name='task-title' contenteditable>${obj.title}</h2>
      </div>
      <p class='task-body' name='task-body' contenteditable>${obj.body}</p>
      <div class='importance-container'>
          <button type='button' name='button' class='up-button'>UPVOTE</button>
          <button type='button' name='button' class='down-button'>DOWNVOTE</button>
          <h4 tabindex="0">importance: </h4>
          <h4 class='importance-rating' tabindex="0">${obj.importance}</h4>
          <button type='button' name='button' class='complete-button'>COMPLETED TASK</button>
      </div>
  </article>`);
}

export const loadTopTenTasks = (storedObjArray) => {
  let storageNumber = 0;
  let displayArray = [];

  storedObjArray.forEach((e) => {
    if (storageNumber < 10) {
      displayArray.push(e);
      storageNumber++
    }
  })
  displayTasks(sortArray(displayArray));
}

const loadRemainingTasks = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!storedObj.completed) {
      loadTask(storedObj);
    }
  }
}

export const displayTasks = (displayArray) => {
  displayArray.forEach((e) => {
    loadTask(e);
  })
}

export const showCompletedTasks = () => {
  const displayedTasksIds = displayedIdCheck();
  const arrayToDisplay = filteredArrayList();

  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let idCheck = displayedTasksIds.indexOf(storedObj.id.toString());
    const numOfTasksDisplayed = $(".task-box").length;


    if(storedObj.completed && idCheck < 0){
      newTask(storedObj);
      complete($($(".task-box")[0]));
      if(globalVars.topTen && globalVars.completedDisplayed && numOfTasksDisplayed > 9){
        $(".task-box").last().remove();
      }
    }
  }
}

export const showMoreTasks = () => {
  updateDisplayedTasks();
}

export const updateDisplayedTasks = () => {
  const checkboxCheck = $(".filter-buttons-container").children("label");
  const arrayToDisplay = filteredArrayList();
  let incompleteTasks = getIncompleteTasks(storageArray());
  clearTasks();

  if(arrayToDisplay.length === 0 && globalVars.topTen && globalVars.completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks));
    showCompletedTasks();
  } else if(arrayToDisplay.length === 0 && !globalVars.topTen && globalVars.completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
    showCompletedTasks();
  } else if(arrayToDisplay.length === 0 && globalVars.topTen && !globalVars.completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks));
  } else if(arrayToDisplay.length === 0 && !globalVars.topTen && !globalVars.completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
  } else {
    if(globalVars.topTen) {
      loadTopTenTasks(sortArray(arrayToDisplay));
    } else {
      displayTasks(sortArray(arrayToDisplay));
    }
  }
}

export const clearTasks = () => {
  let taskArray = $(".task-box");
  let completedArray = 0;

  taskArray.each((i) => {
    if($(taskArray[i]).prop("class") !== "task-box") {
      completedArray++;
    }
  });

  taskArray.remove();
  return completedArray;
}
