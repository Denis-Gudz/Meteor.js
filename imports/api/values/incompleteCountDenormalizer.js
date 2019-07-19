import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Values } from './values.js';
import { Lists } from '../lists/lists.js';

const incompleteCountDenormalizer = {
  _updateList(listId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const incompleteCount = Values.find({
      listId,
      checked: false,
    }).count();

    Lists.update(listId, { $set: { incompleteCount } });
  },
  afterInsertValue(value) {
    this._updateList(value.listId);
  },
  afterUpdateValue(selector, modifier) {
    check(modifier, { $set: Object });

    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      Values.find(selector, { fields: { listId: 1 } }).forEach((value) => {
        this._updateList(value.listId);
      });
    }
  },

  afterRemoveValues(values) {
    values.forEach(value => this._updateList(value.listId));
  },
};

export default incompleteCountDenormalizer;
