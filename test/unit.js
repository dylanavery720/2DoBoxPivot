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
    var todo = new NewTodo('Kale');
    assert.equal(todo.importance, 'Normal');
    });

  it('should accept a custom title', () => {
    var todo = new NewTodo(1, 'Kale');
    assert.equal(todo.title, 'Kale');
    });

  it('should accept a custom body', () => {
    var todo = new NewTodo(2, 'Kale', 'its not just for lining the buffet at Pizza Hut');
    assert.equal(todo.body, 'its not just for lining the buffet at Pizza Hut');
    });

  it('should not be completed upon creation', () => {
    var todo = new NewTodo(2, 'Kale', 'its not just for lining the buffet at Pizza Hut');
    assert.equal(todo.completed, false);
    });
});
