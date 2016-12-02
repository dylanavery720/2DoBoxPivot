const $ = require("jquery");

$(document).ready(() => {
  let incompleteTasks = [];
  let storedObjArray = storageArray();

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  })

  loadTopTenTasks(sortArray(incompleteTasks));
  $('#save-button').prop('disabled', true);
});

const $title = $('#title-input');
const $body = $('#body-input');
const $userSearch = $('#search-box');
const $h2 = $('h2');
const $p = $('p');
const importanceLevel = ["None", "Low", "Normal", "High", "Critical"];
let topTen = true;
let completedDisplayed = false;
let showCompleteBtnToggle = false;

class NewIdea {
  constructor(id, title, body, importance = "Normal", completed = false) {
    return {id, title, body, importance, completed};
  }
}

const newTask = (obj) => {
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

const deleteIdeaStorage = (id) => {
  localStorage.removeItem(id);
}

const loadRemainingTasks = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!storedObj.completed) {
      loadTask(storedObj);
    }
  }
}

const loadTopTenTasks = (storedObjArray, numCompletedTasks = 0) => {
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

const displayTasks = (displayArray) => {
  displayArray.forEach((e) => {
    loadTask(e);
  })
}

const storageArray = () => {
  let storageArray = [];
  for(let i=0; localStorage.length>i; i++){
    let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    storageArray.push(obj);
  }
  return storageArray;
}

const displayedCheck = () => {
  let displayedTasksArray = $(".task-box");
  let displayedTasksIds = [];

  displayedTasksArray.each((i) => {
    if($(displayedTasksArray[i]).prop("class") === "task-box completed-task"){
      displayedTasksIds.push($(displayedTasksArray[i]).prop("id"));
    }
  });

  return displayedTasksIds;
}

const showCompletedTasks = () => {
  let displayedTasksIds = displayedCheck();

  for (let i = 0; i < localStorage.length; i++) {
    let storedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let idCheck = displayedTasksIds.indexOf(storedObj.id.toString());
    let numCompletedTasks = 0;

    if(storedObj.completed && idCheck < 0){
      newTask(storedObj);
      complete($($(".task-box")[0]));
      if(topTen && completedDisplayed && !showCompleteBtnToggle){
        $(".task-box").last().remove();
      }
    }
  }
}

const complete = (task, clickEvent) => {
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

  if(storedObj.completed && clickEvent === "click") {
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

const getIncompleteTasks = (storedObjArray) => {
  let incompleteTasks = [];

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  });
  return incompleteTasks;
}

const showMoreTasks = () => {
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
    incompleteTasks.forEach((i) => {
      if(e === i.importance){
        arrayToDisplay.push(i)
      }
    })
  })

  if( filterArray.length === 0 && topTen && completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks), numCompletedTasks);
    showCompletedTasks();
  } else if(filterArray.length === 0 && !topTen && completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
    showCompletedTasks();
  } else if(filterArray.length === 0 && topTen && !completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks));
  } else if(filterArray.length === 0 && !topTen && !completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
  } else {
    if(topTen) {
      loadTopTenTasks(sortArray(arrayToDisplay));
    } else {
      displayTasks(sortArray(arrayToDisplay));
    }
  }
}

const sortArray = (taskArray) => {
  taskArray.sort((a, b) => {
    return b.id - a.id;
  });
  return taskArray;
}

const clearTasks = () => {
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
  newTask(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

$("#search-box").keyup((e) => {
  search($(e.target).val().toLowerCase())
})

const search = (searchInput) => {
  const taskArray = $("article");
  taskArray.each((e) => {
    let title = $(taskArray[e]).find(".task-title").text().toLowerCase();
    let body = $(taskArray[e]).find(".task-body").text().toLowerCase();
    if(title.indexOf(searchInput) < 0 && body.indexOf(searchInput) < 0) {
      $(taskArray[e]).hide();
    } else {
      $(taskArray[e]).show();
    }
  })
}

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

$('#title-input').keydown((e) => {
  let titleLim = 60;
  let titleLength = $title.val().length;

  if(titleLength > titleLim){
     e.preventDefault();
   }
})

$('#body-input').keydown((e) => {
  let bodyLim = 120;
  let bodyLength = $body.val().length;

  if(bodyLength > bodyLim){
    e.preventDefault();
  }
})

const inputCheck = () => {
  return /\S/.test($title.val()) && /\S/.test($body.val());
}

$('#save-button').on('click', () => {
  let val = [Date.now(), $title.val(), $body.val()];
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

  if(completedDisplayed && topTen){
    clearTasks();
    incompleteTasks.forEach((i) => {
      if(!i.completed){
        arrayToDisplay.push(i)
      }
    })
    loadTopTenTasks(sortArray(arrayToDisplay));
    completedDisplayed = false;
  } else if(completedDisplayed && !topTen){
    clearTasks();
    incompleteTasks.forEach((i) => {
      if(!i.completed){
        arrayToDisplay.push(i)
      }
    })
    displayTasks(sortArray(arrayToDisplay));
    completedDisplayed = false;
  } else {
    completedDisplayed = true;
    showCompletedTasks();
  }

  if(!showCompleteBtnToggle){
    showCompleteBtnToggle = true;
  } else {
    showCompleteBtnToggle = false;
  }
});

$("#show-more-button").on("click", () => {
  showCompleteBtnToggle = true;
  if(topTen){
    topTen = false;
  } else {
    topTen = true;
  }
  showMoreTasks();
})

$(".filter-buttons-container").on("click", (e) => {
  const checkboxCheck = $(".filter-buttons-container").children("label");
  let incompleteTasks = getIncompleteTasks(storageArray());
  let numCompletedTasks = clearTasks();
  let filterArray = [];
  let arrayToDisplay = [];

  $(".task-box").remove();
  completedDisplayed = false;

  checkboxCheck.each((e) => {
    if($(checkboxCheck[e]).children().is(":checked")){
      filterArray.push($(checkboxCheck[e]).text());
    }
  })

  filterArray.forEach((e) => {
    incompleteTasks.forEach((i) => {
      if(e === i.importance){
        arrayToDisplay.push(i)
      }
    })
  })

  if( filterArray.length === 0 && topTen && completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks), numCompletedTasks);
    showCompletedTasks();
  } else if(filterArray.length === 0 && !topTen && completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
    showCompletedTasks();
  } else if(filterArray.length === 0 && topTen && !completedDisplayed) {
    loadTopTenTasks(sortArray(incompleteTasks));
  } else if(filterArray.length === 0 && !topTen && !completedDisplayed) {
    displayTasks(sortArray(incompleteTasks));
  } else {
    if(topTen) {
      loadTopTenTasks(sortArray(arrayToDisplay));
    } else {
      displayTasks(sortArray(arrayToDisplay));
    }
  }

  // if(filterArray.length === 0 && topTen && !completedDisplayed){
  //   loadTopTenTasks(sortArray(incompleteTasks));
  // } else if (filterArray.length === 0 && !topTen && !completedDisplayed){
  //   displayTasks(sortArray(incompleteTasks));
  // } else {
  //   if(topTen){
  //     loadTopTenTasks(sortArray(arrayToDisplay));
  //   } else {
  //     displayTasks(sortArray(arrayToDisplay));
  //   }
  // }
})
