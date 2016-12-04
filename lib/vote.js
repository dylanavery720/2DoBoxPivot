import * as globalVars from "./globalVars";

export const updateVote = (taskCard) => {
  const $selector = taskCard.closest(".task-box");
  const $importance = $selector.find('.importance-rating');
  const buttonPressed = taskCard.text();
  const id = $selector.attr('id');
  const storedObj = JSON.parse(localStorage.getItem(id));
  let currentImportance = storedObj.importance;
  let importanceLevelIndex = globalVars.importanceLevel.indexOf(currentImportance);

  if(importanceLevelIndex < 4 && buttonPressed === "UPVOTE"){
    let index = importanceLevelIndex + 1;
    let newImportanceLevel = globalVars.importanceLevel[index];
    $importance.text(newImportanceLevel);
    storedObj.importance = newImportanceLevel;
  }

  if(importanceLevelIndex > 0 && buttonPressed === "DOWNVOTE"){
    let index = importanceLevelIndex - 1;
    let newImportanceLevel = globalVars.importanceLevel[index];
    $importance.text(newImportanceLevel);
    storedObj.importance = newImportanceLevel;
  }

  localStorage.setItem(id, JSON.stringify(storedObj));
}
