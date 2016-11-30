const $ = require("jquery");

$(document).ready(() => {
  loadStorage();
  $('#save-button').prop('disabled', true);
});

const $title = $('#title-input');
const $body = $('#body-input');
const $userSearch = $('#search-box');
const $h2 = $('h2');
const $p = $('p');
const importanceLevel = ["None", "Low", "Normal", "High", "Critical"];

class NewIdea {
  constructor(id, title, body, importance = "Normal", completed = false) {
    return {id, title, body, importance, completed};
  }
}

const newIdeaBoxCreator = (obj) => {
  $('.task-container').prepend(`
    <article id=${obj.id} class='task-box'>
      <div class='flexer'>
        <h2 class='task-title' contenteditable='true'>${obj.title}</h2>
        <button type='button' name='button' class='delete-button'>DELETE</button>
      </div>
      <p class='task-body' contenteditable='true'>${obj.body}</p>
      <div class='importance-container'>
        <button type='button' name='button' class='up-button'>UPVOTE</button>
        <button type='button' name='button' class='down-button'>DOWNVOTE</button>
        <h4 tabindex="0">importance: </h4>
        <h4 class='importance-rating' tabindex="0">${obj.importance}</h4>
        <button type='button' name='button' class='complete-button'>COMPLETED TASK</button>
        <button type='button' name='button' class='show-more-button'>SHOW MORE 2Dos</button>
      </div>
  </article>`);
}

const deleteIdeaStorage = (id) => {
  localStorage.removeItem(id);
}

const loadStorage = () => {
  let storageNumber = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!storedObj.completed && storageNumber < 10) {
      newIdeaBoxCreator(storedObj);
      storageNumber++;
    }
  }
}

const showCompleted = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(storedObj.completed){
      newIdeaBoxCreator(storedObj);

      const $selector = $(".task-container").find(`#${storedObj.id}`);

      $selector.addClass("completed-task");

      let buttonArray = [".up-button, .down-button"];
      buttonArray.forEach((e) => {
        $selector.find(e).prop("disabled", true);
      });

      let selectorArray = [".task-title, .task-body, h4"];
      selectorArray.forEach((e) => {
        $selector.find(e).addClass("completed-task");
      })
    }
  }
  $("#show-completed-button").prop("disabled", true)
}




// const showMore = () => {
//
// }

const complete = (task) => {
  const $selector = task.closest(".task-box");
  const id = $selector.prop("id");
  let storedObj = JSON.parse(localStorage.getItem(id));

  $selector.toggleClass("completed-task");

  let selectorArray = [".task-title, .task-body, h4"];
  selectorArray.forEach((e) => {
    $selector.find(e).toggleClass("completed-task");
  })

  let buttonArray = [".up-button, .down-button"];
  buttonArray.forEach((e) => {
    if($selector.find(e).prop("disabled") === false) {
      $selector.find(e).prop("disabled", true);
    } else {
      $selector.find(e).prop("disabled", false);
    }
  });

  if(storedObj.completed) {
    storedObj.completed = false;
  } else {
    storedObj.completed = true;
  }

  localStorage.setItem(id, JSON.stringify(storedObj));
}

const clearFields = () => {
  $title.val('');
  $body.val('');
  $('#save-button').prop('disabled', true);
}

const updateVote = (taskCard) => {
  const $selector = taskCard.closest(".task-box");
  const $importance = $selector.find('.importance-rating');
  const buttonPressed = taskCard.text();
  const id = $selector.attr('id');
  const storedObj = JSON.parse(localStorage.getItem(id));
  let currentImportance = storedObj.importance;
  let importanceLevelIndex = importanceLevel.indexOf(currentImportance);

  if(importanceLevelIndex < 4 && buttonPressed === "UPVOTE"){
    let index = importanceLevelIndex + 1;
    let newImportanceLevel = importanceLevel[index];
    $importance.text(newImportanceLevel);
    storedObj.importance = newImportanceLevel;
  }

  if(importanceLevelIndex > 0 && buttonPressed === "DOWNVOTE"){
    let index = importanceLevelIndex - 1;
    let newImportanceLevel = importanceLevel[index];
    $importance.text(newImportanceLevel);
    storedObj.importance = newImportanceLevel;
  }

  localStorage.setItem(id, JSON.stringify(storedObj));
}

const mainFunction = (obj) => {
  newIdeaBoxCreator(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

$("#search-box").keyup(function() {
  const searchInput = $(this).val();
  $("article").each(function() {
    let title = $(this).find(".task-title").text();
    let body = $(this).find(".task-body").text();
    if(title.indexOf(searchInput) < 0 && body.indexOf(searchInput) < 0) {
      $(this).hide();
    } else {
      $(this).show();
    }
  })
})

$('.all-input').keyup(() => {
  if (inputCheck()) {
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

$('.all-input').keypress((event) => {
  if($body.is(":focus") && event.keyCode === 13){
    event.preventDefault();
  }

   if (event.keyCode === 13 && inputCheck()) {
    $('#save-button').click();
    $($title.focus());
  }
});

const inputCheck = () => {
  return /\S/.test($title.val()) && /\S/.test($body.val());
}

$('#save-button').on('click', () => {
  let val = [Date.now(), $title.val(), $body.val()];
  let newIdeaObject = new NewIdea(...val);
  mainFunction(newIdeaObject);
});

$('.task-container').on('click', '.delete-button', function() {
  let $selector = $(this).closest(".task-box");
  let id = $selector.attr('id');
  localStorage.removeItem(id);
  $selector.remove();
});

$('.task-container').on('click', '.up-button, .down-button', function() {
  updateVote($(this));
});

$('.task-container').on('blur', ".task-title, .task-body", function(event) {
  let $selector = $(this).closest(".task-box");
  let id = $selector.prop("id");
  let storedObj = JSON.parse(localStorage.getItem(id));
  storedObj.title = $selector.find(".task-title").text();
  storedObj.body = $selector.find(".task-body").text();
  localStorage.setItem(id, JSON.stringify(storedObj));
});

$('.task-container').on('keypress', '.task-title, .task-body', function(event) {
  if(event.keyCode === 13){
    event.preventDefault();
    $(this).blur();
    $("#title-input").focus();
  }
});

$('.task-container').on('click', '.complete-button', function() {
  complete($(this));
});

$("#show-completed-button").on("click", () => {
  showCompleted();
});

// $("#show-more-button").on("click", () => {
//   showMore();
// })
