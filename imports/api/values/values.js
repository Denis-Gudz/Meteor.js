import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';

import { Lists } from '../lists/lists.js';

class ValuesCollection extends Mongo.Collection {
    insert(doc, callback) {
        const ourDoc = doc;
        const result = super.insert(ourDoc, callback);
        incompleteCountDenormalizer.afterInsertValue(ourDoc);
        return result;
    }
    update(selector, modifier) {
        const result = super.update(selector, modifier);
        incompleteCountDenormalizer.afterUpdateValue(selector, modifier);
        return result;
    }
    remove(selector) {
        const values = this.find(selector).fetch();
        const result = super.remove(selector);
        incompleteCountDenormalizer.afterRemoveValues(values);
        return result;
    }
}

export const Values = new ValuesCollection('values');

Values.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Values.schema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    listId: {
        type: String,
    },
    name: {
        type: String,
        max: 100,
        optional: true,
    },
    value: {
        type: String,
    },
});

Values.attachSchema(Values.schema);

Values.publicFields = {
    listId: 1,
    name: 1,
    value: 1,
};

Factory.define('value', Values, {
    listId: () => 1,
    name: () => "eeee",
    value:() => 2,
});

Values.helpers({
    list() {
        return Lists.findOne(this.listId);
    },
});