const $ = require("jquery");

$(document).ready(() => {
  if(localStorage.length !== 0)
    loadStorage();
  $('#save-button').prop('disabled', true);
});

const $title = $('#title-input');
const $body = $('#body-input');
const $userSearch = $('#search-box');
const $h2 = $('h2');
const $p = $('p');

class NewIdea {
  constructor(id, title, body, quality = "swill", completed = false) {
    return {id, title, body, quality, completed};
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
      <div class='quality-container'>
        <button type='button' name='button' class='up-button'>UP</button>
        <button type='button' name='button' class='down-button'>DOWNVOTE</button>
        <h4 tabindex="0">quality: </h4>
        <h4 class='quality-rating' tabindex="0">${obj.quality}</h4>
        <button type='button' name='button' class='complete-button'>COMPLETED TASK</button>
      </div>
  </article>`);
}

const deleteIdeaStorage = (id) => {
  localStorage.removeItem(id);
}

const loadStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!storedObj.completed)
      newIdeaBoxCreator(storedObj);
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

const upVote = (taskCard) => {
  const $selector = taskCard.closest(".task-box");
  const $quality = $selector.find('.quality-rating');
  const $currentId = $selector.attr('id');
  const storedObj = JSON.parse(localStorage.getItem($currentId));

  if($quality.text() === "swill"){
    $quality.text("plausible");
    storedObj.quality = "plausible";
  }
  else if($quality.text() === "plausible"){
    $quality.text("genius");
    storedObj.quality = "genius";
  }
  localStorage.setItem($currentId, JSON.stringify(storedObj));
}

const downVote = (taskCard) => {
  const $selector = taskCard.closest(".task-box");
  const $quality = $selector.find('.quality-rating');
  const $currentId = $selector.attr('id');
  const storedObj = JSON.parse(localStorage.getItem($currentId));

  if($quality.text() === "genius"){
    $quality.text("plausible");
    storedObj.quality = "plausible";
  }
  else if($quality.text() === "plausible"){
    $quality.text("swill");
    storedObj.quality = "swill";
  }
  localStorage.setItem($currentId, JSON.stringify(storedObj));
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
  let $id = $selector.attr('id');
  localStorage.removeItem($id);
  $selector.remove();
});

$('.task-container').on('click', '.up-button', function() {
  upVote($(this));
});

$('.task-container').on('click', '.down-button', function() {
  downVote($(this));
});

$('.task-container').on('blur', ".task-title, .task-body", function(event) {
  let $selector = $(this).closest(".task-box");
  let $id = $selector.prop("id");
  let storedObj = JSON.parse(localStorage.getItem($id));
  storedObj.title = $selector.find(".task-title").text();
  storedObj.body = $selector.find(".task-body").text();
  localStorage.setItem($id, JSON.stringify(storedObj));
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
})
