import { Meteor } from 'meteor/meteor';
import { Values } from '../../api/values/values.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Values.find().count() === 0) {
    const data = [
      {
        listId: "1",
        name: 'Meteor Principles',
        value: 12345,
      },
    ];

    let timestamp = (new Date()).getTime();

    data.forEach((list) => {
      const listId = Values.insert({
        listId: list.listId,
        name: list.name,
        value: list.value,
      });
    });
  }
});
