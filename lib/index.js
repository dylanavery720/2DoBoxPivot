var $ = require("jquery");

$(document).ready(function() {
  if(localStorage.length !== 0)
    loadStorage();
  $('#save-button').prop('disabled', true);
});

var $title = $('#title-input');
var $body = $('#body-input');
var $userSearch = $('#search-box');
var $h2 = $('h2');
var $p = $('p');

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


function getStorage(id) {
  return JSON.parse(localStorage.getItem(id));
}

function deleteIdeaStorage(id) {
  localStorage.removeItem(id);
}

function loadStorage () {
  for (var i = 0; i < localStorage.length; i++) {
    var storedInfo = JSON.parse(localStorage.getItem(localStorage.key(i)));
    newIdeaBoxCreator(storedInfo);
  }
}

function clearFields() {
  $title.val('');
  $body.val('');
  $('#save-button').prop('disabled', true);
}

function upVote(ideaCard) {
  var $selector = ideaCard.closest(".idea-box");
  var $quality = $selector.find('.quality-rating');
  var $currentId = $selector.attr('id');
  var storedObj = JSON.parse(localStorage.getItem($currentId));

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
  var $selector = ideaCard.closest(".idea-box");
  var $quality = $selector.find('.quality-rating');
  var $currentId = $selector.attr('id');
  var storedObj = JSON.parse(localStorage.getItem($currentId));

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
   var filter = $(this).val(), count = 0;
   $('article').each(function(){
     if ($(this).text().search(new RegExp(filter, "i")) < 0) {
       $(this).hide();
     } else {$(this).show();
       count++;
     }
   });
 });

$('.all-input').keyup(function saveDisable() {
  if ($title.val() && $body.val()) {
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

$('.all-input').keypress(function(event){
  if (event.which == 13 && $title.val() && $body.val()) {
    event.preventDefault();
    $('#save-button').click();
  }
});

$('#save-button').on('click', function() {
  var newIdeaObject = new NewIdea(Date.now(), $title.val(), $body.val(), 'swill');
  mainFunction(newIdeaObject);
});

$('.idea-container').on('click', '.delete-button', function() {
  var deleteID = $(this).parent().parent().attr('id');
  localStorage.removeItem(deleteID);
  $(this).parent().parent().remove();
});

$('.idea-container').on('click', '.up-button', function() {
  upVote($(this));
});


$('.idea-container').on('click', '.down-button', function() {
  downVote($(this));
});


$('.idea-container').on('blur', ".idea-box", function(event) {
  var id = $(this).prop("id");
  var storedObj = JSON.parse(localStorage.getItem(id));
  storedObj.title = $(this).find(".idea-title").text();
  storedObj.body = $(this).find(".idea-body").text();
  localStorage.setItem(id, JSON.stringify(storedObj));
});

$('.idea-container').on('keypress', '.idea-box', function(event) {
  if(event.which == 13){
    event.preventDefault();
    $(this).blur();
  }
});
