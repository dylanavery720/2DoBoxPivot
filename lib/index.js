const $ = require("jquery");

$(document).ready(function() {
  if(localStorage.length !== 0)
    loadStorage();
  $('#save-button').prop('disabled', true);
});

const $title = $('#title-input');
const $body = $('#body-input');
const $userSearch = $('#search-box');
const $h2 = $('h2');
const $p = $('p');

function NewIdea(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = quality || "swill";
}

function newIdeaBoxCreator(object) {
  $('.idea-container').prepend(`<article id=${object.id} class='idea-box'>
      <div class='flexer'>
        <h2 class='idea-title' contenteditable='true'>${object.title}</h2>
        <button type='button' name='button' class='delete-button'></button>
      </div>
      <p class='idea-body' contenteditable='true'>${object.body}</p>
      <div class='quality-container'>
        <button type='button' name='button' class='up-button'></button>
        <button type='button' name='button' class='down-button'></button>
        <h4>quality: </h4>
        <h4 class='quality-rating'>${object.quality}</h4>
      </div>
  </article>`);
}

function deleteIdeaStorage(id) {
  localStorage.removeItem(id);
}

function loadStorage () {
  for (let i = 0; i < localStorage.length; i++) {
    let storedInfo = JSON.parse(localStorage.getItem(localStorage.key(i)));
    newIdeaBoxCreator(storedInfo);
  }
}

function clearFields() {
  $title.val('');
  $body.val('');
  $('#save-button').prop('disabled', true);
}

function upVote(ideaCard) {
  let $selector = ideaCard.closest(".idea-box");
  let $quality = $selector.find('.quality-rating');
  let $currentId = $selector.attr('id');
  let storedObj = JSON.parse(localStorage.getItem($currentId));

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

function downVote(ideaCard) {
  let $selector = ideaCard.closest(".idea-box");
  let $quality = $selector.find('.quality-rating');
  let $currentId = $selector.attr('id');
  let storedObj = JSON.parse(localStorage.getItem($currentId));

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

function mainFunction(obj){
  newIdeaBoxCreator(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

$('#search-box').keyup(function(){
   let filter = $(this).val(), count = 0;
   $('article').each(function(){
     if ($(this).text().search(new RegExp(filter, "i")) < 0) {
       $(this).hide();
     } else {$(this).show();
       count++;
     }
   });
 });

$('.all-input').keyup(function() {
  if (inputCheck()) {
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

$('.all-input').keypress(function(event){
  if($body.is(":focus") && event.keyCode === 13){
    event.preventDefault();
  }

   if (event.keyCode === 13 && inputCheck()) {
    $('#save-button').click();
    $($title.focus());
  }
});

function inputCheck() {
  return /\S/.test($title.val()) && /\S/.test($body.val());
}

$('#save-button').on('click', function() {
  let newIdeaObject = new NewIdea(Date.now(), $title.val(), $body.val());
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
