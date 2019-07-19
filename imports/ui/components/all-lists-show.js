/* global confirm */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './all-lists-show.html';

// Component used in the template
import './todos-item.js';
import {Lists} from "../../api/lists/lists";
import { Todos } from '../../api/todos/todos.js';
import {Indicats} from "../../api/indicats/indicats";

Template.All_lists_show.onCreated(function listShowOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      lists: {type: Function},
    }).validate(Template.currentData());
  });

  this.getTodosList = (listId) =>{
    const todosList = Indicats.find({listId: listId}).fetch();
    // const todosList = Todos.findByListId(listId);
    return todosList ? todosList : [];
  };

  this.getTodosListLenght = (listId) =>{
    const todosList = this.getTodosList(listId);
    return todosList ? todosList.length : 0;
  };

});

Template.All_lists_show.helpers({

  todos(list){
    return Template.instance().getTodosList(list.id);
  },

  count(list){
    return Template.instance().getTodosListLenght(list.id) / 12 * 100;
  },

  todosLength(list){
    return Template.instance().getTodosListLenght(list.id);
  }

});

Template.All_lists_show.onRendered(function () {
    $('.collapsible').collapsible();
});

