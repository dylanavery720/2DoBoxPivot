const assert    = require('assert');
const webdriver = require('selenium-webdriver');
const test      = require('selenium-webdriver/testing')

test.describe('testing ideabox', function(){
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
})
