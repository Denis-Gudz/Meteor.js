/* global confirm */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';
import { $ } from 'meteor/jquery';

import './lists-show.html';

// Component used in the template
import './todos-item.js';
import {Lists} from "../../api/lists/lists";
import { Todos } from '../../api/todos/todos.js';
import { Values } from '../../api/values/values.js';

import { Indicats } from "../../api/indicats/indicats.js";

import {
  insert,
} from '../../api/values/methods.js';

import { displayError } from '../lib/errors.js';

Template.Lists_show.onCreated(function listShowOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      list: { type: Function},
      todosReady: { type: Boolean },
    }).validate(Template.currentData());
  });

  this.getTodosList = () =>{
    const list = this.data.list();
    return Indicats.find({listId: list.id}) ? Indicats.find({listId: list.id}).fetch() : [];
    // return Todos.findByListId(list.id) ? Todos.findByListId(list.id) : [];
  };

});

Template.Lists_show.helpers({
   todos(){
     return Template.instance().getTodosList();
   },

  count(){
    var todosList = Template.instance().getTodosList();
    return todosList.length / 12 * 100;
  },

  options(){
     return [
       {value: 1, name: "January"},
       {value: 2, name: "February"},
       {value: 3, name: "March"},
       {value: 4, name: "April"},
       {value: 5, name: "May"},
       {value: 6, name: "June"},
       {value: 7, name: "July"},
       {value: 8, name: "August"},
       {value: 9, name: "September"},
       {value: 10, name: "October"},
       {value: 11, name: "November"},
       {value: 12, name: "December"},
    ]
  }

});

Template.Lists_show.onRendered(function () {
    $('select').material_select();
});

Template.Lists_show.events({

  'click .js-todo-add'(event, instance) {
    event.preventDefault();

    const $inputText = instance.$('.js-todo-new input');

    if(!$inputText["0"].value || !$inputText["1"].value){
      return;
    }

    Indicats.insert({
      listId:this.list().id,
      name: $inputText["0"].value,
      value:$inputText["1"].value,
    });

    // insert.call({
    //   listId: this.list().id,
    //   name: $inputText["0"].value,
    //   value: $inputText["1"].value,
    // }, displayError);

    $inputText["0"].value = '';
    $inputText["1"].value = '';

  },

  'submit .js-todo-new'(event) {

  },

});
