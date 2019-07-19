import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';

import { Lists } from '../lists/lists.js';

import {Mongo} from "meteor/mongo";

class TodosCollection {

  todos = [
    {id: '1', listId: '1', name: 'January', value: '1234',},
    {id: '2', listId: '1', name: 'February', value: '1234',},
    {id: '3', listId: '1', name: 'March', value: '1234',},
    {id: '4', listId: '1', name: 'April', value: '1234',},
    {id: '5', listId: '1', name: 'May', value: '1234',},
    {id: '6', listId: '1', name: 'June', value: '1234',},
    {id: '7', listId: '1', name: 'July', value: '1234',},

    {id: '8', listId: '2', name: 'January', value: '1234',},
    {id: '9', listId: '2', name: 'February', value: '1234',},
    {id: '10', listId: '2', name: 'March', value: '1234',},

    {id: '11', listId: '3', name: 'January', value: '1234',},
    {id: '12', listId: '3', name: 'February', value: '1234',},
    {id: '13', listId: '3', name: 'March', value: '1234',},
    {id: '14', listId: '3', name: 'April', value: '1234',},
    {id: '15', listId: '3', name: 'June', value: '1234',},
  ];

  findByListId(listId){
    return  this.todos.filter(function(element, index, array){
      return element.listId === listId;
    }, listId);
  };

}

export const Todos = new TodosCollection('todos');


Todos.schema = new SimpleSchema({
  id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  listId: {
    type: String,
  },
  text: {
    type: String,
    max: 100,
  },
  value:{
    type: String,
  },
});
