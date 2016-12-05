const $ = require("jquery");
import * as globalVars from "./globalVars";
import {inputCheck, mainFunction, getIncompleteTasks, sortArray, filteredArrayList, completeButtonToggle, filterCheckboxList} from "./miscFunctions";
import NewTodo, {clearTasks, showCompletedTasks, loadTopTenTasks, displayTasks, showMoreTasks, updateDisplayedTasks} from "./taskLoader";
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
  let newTodoObject = new NewTodo(...val);
  mainFunction(newTodoObject);
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
  let incompleteTasks = getIncompleteTasks(storageArray());
  if(globalVars.completedDisplayed && globalVars.topTen){
    clearTasks();
    loadTopTenTasks(sortArray(incompleteTasks));
    globalVars.completedDisplayed = false;

  } else if(globalVars.completedDisplayed && !globalVars.topTen){
    clearTasks();
    displayTasks(sortArray(incompleteTasks));
    globalVars.completedDisplayed = false;

  } else {
    globalVars.completedDisplayed = true;
    showCompletedTasks();
  }
  completeButtonToggle();
});

$("#show-more-button").on("click", () => {
  if(globalVars.topTen){
    globalVars.topTen = false;
    $("#show-more-button").text("Show Recent 10 2Do's");
  } else {
    globalVars.topTen = true;
    $("#show-more-button").text("Show More 2Do's");
  }
  showMoreTasks();
})

$(".filter-buttons-container").on("click", (e) => {
  $(".task-box").remove();
  globalVars.completedDisplayed = false;
  globalVars.showCompleteBtnToggle = false;
  $("#show-completed-button").text("Show Completed 2Do's");
  if(filterCheckboxList().length){
    $("#show-completed-button").prop("disabled", true)
  } else {
    $("#show-completed-button").prop("disabled", false)
  }
  updateDisplayedTasks();
})
