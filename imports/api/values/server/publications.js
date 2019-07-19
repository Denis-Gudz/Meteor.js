/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Values } from '../values.js';
import { Lists } from '../../values/values.js';

Meteor.publishComposite('values.inList', function valuesInList(params) {
  new SimpleSchema({
    listId: { type: String },
  }).validate(params);

  const { listId } = params;

  return {
    find() {
      const query = {
        _id: listId,
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the todos
      const options = {
        fields: { _id: 1 },
      };

      return Lists.find(query, options);
    },

    children: [{
      find(list) {
        return Values.find({ listId: list._id }, { fields: Values.publicFields });
      },
    }],
  };
});
