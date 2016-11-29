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
  constructor(id, title, body, quality = "swill") {
    return {id, title, body, quality};
  }
}

const newIdeaBoxCreator = (obj) => {
  $('.idea-container').prepend(`
    <article id=${obj.id} class='idea-box'>
      <div class='flexer'>
        <h2 class='idea-title' contenteditable='true'>${obj.title}</h2>
        <button type='button' name='button' class='delete-button'></button>
      </div>
      <p class='idea-body' contenteditable='true'>${obj.body}</p>
      <div class='quality-container'>
        <button type='button' name='button' class='up-button'></button>
        <button type='button' name='button' class='down-button'></button>
        <h4>quality: </h4>
        <h4 class='quality-rating'>${obj.quality}</h4>
      </div>
  </article>`);
}

const deleteIdeaStorage = (id) => {
  localStorage.removeItem(id);
}

const loadStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let storedInfo = JSON.parse(localStorage.getItem(localStorage.key(i)));
    newIdeaBoxCreator(storedInfo);
  }
}

const clearFields = () => {
  $title.val('');
  $body.val('');
  $('#save-button').prop('disabled', true);
}

const upVote = (ideaCard) => {
  const $selector = ideaCard.closest(".idea-box");
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

const downVote = (ideaCard) => {
  const $selector = ideaCard.closest(".idea-box");
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
    let title = $(this).find(".idea-title").text();
    let body = $(this).find(".idea-body").text();
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

$('.idea-container').on('click', '.delete-button', function() {
  let $selector = $(this).closest(".idea-box");
  let $id = $selector.attr('id');
  localStorage.removeItem($id);
  $selector.remove();
});

$('.idea-container').on('click', '.up-button', function() {
  upVote($(this));
});


$('.idea-container').on('click', '.down-button', function() {
  downVote($(this));
});


$('.idea-container').on('blur', ".idea-title, .idea-body", function(event) {
  let $selector = $(this).closest(".idea-box");
  let $id = $selector.prop("id");
  let storedObj = JSON.parse(localStorage.getItem($id));
  storedObj.title = $selector.find(".idea-title").text();
  storedObj.body = $selector.find(".idea-body").text();
  localStorage.setItem($id, JSON.stringify(storedObj));
});

$('.idea-container').on('keypress', '.idea-title, .idea-body', function(event) {
  if(event.keyCode === 13){
    event.preventDefault();
    $(this).blur();
  }
});
