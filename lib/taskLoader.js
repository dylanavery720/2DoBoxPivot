const $ = require("jquery");
import * as globalVars from "./globalVars";
import {sortArray, displayedCheck, getIncompleteTasks} from "./miscFunctions";
import "./clickEvents";
import {complete} from "./completeTask";
import {storageArray} from "./storage";



export default class NewIdea {
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
        <button type='button' name='button' class='delete-button'>DELETE</button>
          <h2 class='task-title' contenteditable>${obj.title}</h2>
      </div>
      <p class='task-body' contenteditable>${obj.body}</p>
      <div class='importance-container'>
          <button type='button' name='button' class='up-button'>UPVOTE</button>
          <button type='button' name='button' class='down-button'>DOWNVOTE</button>
          <h4 tabindex="0">importance: </h4>
          <h4 class='importance-rating' tabindex="0">${obj.importance}</h4>
          <button type='button' name='button' class='complete-button'>COMPLETED TASK</button>
      </div>
  </article>`);
}

export const loadTopTenTasks = (storedObjArray, numCompletedTasks = 0) => {
  let storageNumber = numCompletedTasks;
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
  let displayedTasksIds = displayedCheck();

  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let idCheck = displayedTasksIds.indexOf(storedObj.id.toString());
    let numCompletedTasks = 0;

    if(storedObj.completed && idCheck < 0){
      newTask(storedObj);
      complete($($(".task-box")[0]));
      if(globalVars.topTen && globalVars.completedDisplayed && !globalVars.showCompleteBtnToggle){
        $(".task-box").last().remove();
      }
    }
  }
}

export const showMoreTasks = () => {
  const checkboxCheck = $(".filter-buttons-container").children("label");
  const storedObjArray = storageArray();
  let numCompletedTasks = clearTasks();
  let incompleteTasks = getIncompleteTasks(storedObjArray);
  let filterArray = [];
  let arrayToDisplay = [];

  checkboxCheck.each((e) => {
    if ($(checkboxCheck[e]).children().is(":checked")) {
      filterArray.push($(checkboxCheck[e]).text());
    }
  })

  filterArray.forEach((e) => {
    storedObjArray.forEach((i) => {
      if(e === i.importance){
        arrayToDisplay.push(i)
      }
    })
  })

  if(filterArray.length === 0 && globalVars.topTen && globalVars.completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks), numCompletedTasks);
    showCompletedTasks();
  } else if(filterArray.length === 0 && !globalVars.topTen && globalVars.completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
    showCompletedTasks();
  } else if(filterArray.length === 0 && globalVars.topTen && !globalVars.completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks));
  } else if(filterArray.length === 0 && !globalVars.topTen && !globalVars.completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
  } else {
    if(topTen) {
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
