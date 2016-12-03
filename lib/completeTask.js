
export const complete = (task, clickEvent) => {
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
