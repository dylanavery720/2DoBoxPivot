const storageArray = () => {
  let storageArray = [];
  for(let i=0; localStorage.length>i; i++){
    let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    storageArray.push(obj);
  }
  return storageArray;
}

const deleteIdeaStorage = (id) => {
  localStorage.removeItem(id);
}
