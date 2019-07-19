import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Values } from '../values/values.js';
import { Lists } from '../lists/lists.js';

export const insert = new ValidatedMethod({
  name: 'values.insert',
  validate: Values.simpleSchema().pick(['listId', 'name', 'value']).validator({ clean: true, filter: false }),
  run({ listId, name, value }) {

    const todo = {
      listId,
      name,
      value,
    };

    Values.insert(todo);
  },
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck([
  insert,
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
