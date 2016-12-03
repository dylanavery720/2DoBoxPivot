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
