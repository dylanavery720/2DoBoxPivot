const assert = require('chai').assert

class NewTodo {
  constructor(id, title, body, importance = "Normal", completed = false) {
    return {id, title, body, importance, completed};
  }
}

describe('todo list test bundle',  () => {
  it('should work',  () => {
    assert(true)
    })

  it('should have a default importance of "Normal"', () => {
    var idea = new NewTodo('Kale');
    assert.equal(idea.importance, 'Normal');
    });

  it('should accept a custom title', () => {
    var idea = new NewTodo(1, 'Kale');
    assert.equal(idea.title, 'Kale');
    });

  it('should accept a custom body', () => {
    var idea = new NewTodo(2, 'Kale', 'its not just for lining the buffet at Pizza Hut');
    assert.equal(idea.body, 'its not just for lining the buffet at Pizza Hut');
    });

  it('should not be completed upon creation', () => {
    var idea = new NewTodo(2, 'Kale', 'its not just for lining the buffet at Pizza Hut');
    assert.equal(idea.completed, false);
    });

});
