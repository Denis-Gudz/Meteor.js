import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Values } from '../values/values.js';
import { Lists } from '../lists/lists.js';

export const insert = new ValidatedMethod({
  name: 'values.insert',
  validate: Todos.simpleSchema().pick(['listId', 'text']).validator({ clean: true, filter: false }),
  run({ listId, text }) {
    const list = Lists.findOne(listId);

    const todo = {
      listId,
      text,
      checked: false,
      createdAt: new Date(),
    };

    Values.insert(todo);
  },
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck([
  insert,
  setCheckedStatus,
  updateText,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(TODOS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
