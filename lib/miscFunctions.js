export const mainFunction = (obj) => {
  newTask(obj);
  localStorage.setItem(obj.id, JSON.stringify(obj));
  clearFields();
}

export const displayedCheck = () => {
  let displayedTasksArray = $(".task-box");
  let displayedTasksIds = [];

  displayedTasksArray.each((i) => {
    if($(displayedTasksArray[i]).prop("class") === "task-box completed-task"){
      displayedTasksIds.push($(displayedTasksArray[i]).prop("id"));
    }
  });

  return displayedTasksIds;
}

export const clearFields = () => {
  $title.val('');
  $body.val('');
  $('#save-button').prop('disabled', true);
}

export const sortArray = (taskArray) => {
  taskArray.sort((a, b) => {
    return b.id - a.id;
  });
  return taskArray;
}

export const getIncompleteTasks = (storedObjArray) => {
  let incompleteTasks = [];

  storedObjArray.forEach((e) => {
    if(!e.completed){
      incompleteTasks.push(e);
    }
  });
  return incompleteTasks;
}
