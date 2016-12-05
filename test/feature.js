const assert    = require('assert');
const webdriver = require('selenium-webdriver');
const test      = require('selenium-webdriver/testing')

test.describe('testing 2dobox', function(){
  this.timeout(10000)
  test.it('should allow me to add a title and a description', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    title.sendKeys('this is a title').then(()=>{
      return title.getAttribute('value')
    }).then((value)=>{
      assert.equal(value, 'this is a title')
    })

    description.sendKeys('this is a description').then(()=>{
      return description.getAttribute('value')
    }).then((value)=>{
      assert.equal(value, 'this is a description')
    })

    driver.quit()
  })

  test.it('should allow me to submit a task', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})


    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
      save.click().then(()=>{
      const tasktitle = driver.findElement({name: 'task-title'})
      const taskbody = driver.findElement({name: 'task-body'})
      return tasktitle.getText()
    }).then((text)=>{
      assert.equal(text, 'this is a title')
    })




    driver.quit()
  })

  test.it('should allow me to add multiple tasks', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})

    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
    save.click();

    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
      save.click().then(()=>{
      const tasktitle = driver.findElement({name: 'task-title'})
      const taskbody = driver.findElement({name: 'task-body'})
      const allTasks = driver.findElements({tagName: 'p'})
      return allTasks;
    }).then((p)=>{
      assert.equal(p.length, 2)
    })




    driver.quit()
  })

  test.it('should allow me to delete tasks', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})

    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
    save.click();

    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
      save.click()

      const deletetask = driver.findElement({name: 'delete-button'})

      deletetask.click();

      driver.findElements({tagName: 'p'}).then((p)=>{
        assert.equal(p.length, 1)
      })






    driver.quit()
  })

  test.it('should increase the importance level when upvote pressed', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})


    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
    save.click().then(()=>{
      const importance = driver.findElement({className: 'importance-rating'})
      const upbutton = driver.findElement({className: 'up-button'})
      upbutton.click()
      return importance.getText();
    }).then((text)=>{
    assert.equal(text, 'High')
})




    driver.quit()
  })

  test.it('should increase the importance level to "Critical" when upvote pressed twice', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})


    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
    save.click().then(()=>{
      const importance = driver.findElement({className: 'importance-rating'})
      const upbutton = driver.findElement({className: 'up-button'})
      upbutton.click()
      upbutton.click()
      return importance.getText();
    }).then((text)=>{
    assert.equal(text, 'Critical')
})




    driver.quit()
  })

  test.it('should decrease the importance level when downvote pressed', ()=>{
    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    driver.get('http://localhost:8080');

    const title = driver.findElement({name: 'title'})
    const description = driver.findElement({name: 'body'})
    const save = driver.findElement({name: 'save-button'})


    title.sendKeys('this is a title')
    description.sendKeys('this is a description')
    save.click().then(()=>{
      const importance = driver.findElement({className: 'importance-rating'})
      const downbutton = driver.findElement({className: 'down-button'})
      downbutton.click()
      return importance.getText();
    }).then((text)=>{
    assert.equal(text, 'Low')
})




    driver.quit()
  })
})
