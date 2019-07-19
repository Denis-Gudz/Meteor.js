import {SimpleSchema} from "meteor/aldeed:simple-schema";
import { Todos } from '../../api/todos/todos.js'

class ListsCollection {
  list =[
      {name: 'Все',     id: "0"},
      {name: 'Пункт 1', id: "1"},
      {name: 'Пункт 2', id: "2"},
      {name: 'Пункт 3', id: "3"},
    ];

  todos(id) {
      return Todos.findByListId(id);
  };

  findOne(id){
    return  this.list.find( function(element, index, array){
      return element.id === id;
    }, id);
  };

  all(){
    var listWithOutFirst = Array.from(this.list);
    listWithOutFirst.shift();
    return listWithOutFirst;
  }
}

export const Lists = new ListsCollection('lists');

Lists.schema = new SimpleSchema({
  id: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String },
  incompleteCount: { type: Number, defaultValue: 0 },
});
