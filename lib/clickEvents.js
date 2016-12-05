const $ = require("jquery");
import * as globalVars from "./globalVars";
import {inputCheck, mainFunction, getIncompleteTasks, sortArray, filteredArrayList} from "./miscFunctions";
import NewIdea, {clearTasks, showCompletedTasks, loadTopTenTasks, displayTasks, showMoreTasks, updateDisplayedTasks} from "./taskLoader";
import {storageArray} from "./storage";
import {updateVote} from "./vote";
import {search} from "./search";
import {complete} from "./completeTask";

$("#search-box").keyup((e) => {
  search($(e.target).val().toLowerCase())
})

$('.all-input').keyup(() => {
  if (inputCheck()) {
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

$('.all-input').keypress((event) => {
  if(globalVars.$body.is(":focus") && event.keyCode === 13){
    event.preventDefault();
  }

   if (event.keyCode === 13 && inputCheck()) {
    $('#save-button').click();
    $(globalVars.$title.focus());
  }
});

$('#title-input').keydown((e) => {
  let titleLim = 60;
  let titleLength = globalVars.$title.val().length;

  if(titleLength > titleLim){
     globalVars.$title.val(globalVars.$title.val().substring(0,60))
   }
})

$('#body-input').keydown((e) => {
  let bodyLim = 120;
  let bodyLength = globalVars.$body.val().length;

  if(bodyLength > bodyLim){
    globalVars.$body.val(globalVars.$body.val().substring(0,120))
  }
})



$('#save-button').on('click', () => {
  let val = [Date.now(), globalVars.$title.val(), globalVars.$body.val()];
  let newIdeaObject = new NewIdea(...val);
  mainFunction(newIdeaObject);
});

$('.task-container').on('click', '.delete-button', (e) => {
  let $selector = $(e.target).closest(".task-box");
  let id = $selector.attr('id');
  localStorage.removeItem(id);
  $selector.remove();
});

$('.task-container').on('click', '.up-button, .down-button', (e) => {
  updateVote($(e.target));
});

$('.task-container').on('blur', ".task-title, .task-body", (e) => {
  let $selector = $(e.target).closest(".task-box");
  let id = $selector.prop("id");
  let storedObj = JSON.parse(localStorage.getItem(id));
  storedObj.title = $selector.find(".task-title").text();
  storedObj.body = $selector.find(".task-body").text();
  localStorage.setItem(id, JSON.stringify(storedObj));
});

$('.task-container').on('keypress', '.task-title, .task-body', (event) => {
  if(event.keyCode === 13){
    event.preventDefault();
    $(event.target).blur();
    $("#title-input").focus();
  }
});

$('.task-container').on('click', '.complete-button', (e) => {
  complete($(e.target), event.type);
});

$("#show-completed-button").on("click", () => {
  let arrayToDisplay = [];
  let incompleteTasks = getIncompleteTasks(storageArray());

  if(globalVars.completedDisplayed && globalVars.topTen){
    clearTasks();
    incompleteTasks.forEach((i) => {
      if(!i.completed){
        arrayToDisplay.push(i)
      }
    })
    loadTopTenTasks(sortArray(arrayToDisplay));
    globalVars.completedDisplayed = false;
  } else if(globalVars.completedDisplayed && !globalVars.topTen){
    clearTasks();
    incompleteTasks.forEach((i) => {
      if(!i.completed){
        arrayToDisplay.push(i)
      }
    })
    displayTasks(sortArray(arrayToDisplay));
    globalVars.completedDisplayed = false;
  } else {
    globalVars.completedDisplayed = true;
    showCompletedTasks();
  }

  if(!globalVars.howCompleteBtnToggle){
    globalVars.howCompleteBtnToggle = true;
  } else {
    globalVars.howCompleteBtnToggle = false;
  }
});

$("#show-more-button").on("click", () => {
  globalVars.howCompleteBtnToggle = true;
  if(globalVars.topTen){
    globalVars.topTen = false;
  } else {
    globalVars.topTen = true;
  }
  showMoreTasks();
})

$(".filter-buttons-container").on("click", (e) => {
  $(".task-box").remove();
  globalVars.completedDisplayed = false;
  updateDisplayedTasks();
})
