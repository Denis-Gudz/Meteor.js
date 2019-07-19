/* global alert */

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import '../components/loading.js';
import './app-body.html';

import { Indicats } from "../../api/indicats/indicats.js";

const CONNECTION_ISSUE_TIMEOUT = 5000;

// A store which is local to this file?
const showConnectionIssue = new ReactiveVar(false);

Meteor.startup(() => {
  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(() => {
    // FIXME:
    // Launch screen handle created in lib/router.js
    // dataReadyHold.release();

    // Show the connection error box
    showConnectionIssue.set(true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.App_body.onCreated(function appBodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    menuOpen: false,
  });

  this.getTodosList = (listId) =>{
    const todosList = Indicats.find({listId: listId}).fetch();
    return todosList ? todosList : [];
  };

  this.getTodosListLenght = (listId) =>{
    const todosList = this.getTodosList(listId);
    return todosList ? todosList.length : 0;
  };

});

Template.App_body.helpers({
  menuOpen() {
    const instance = Template.instance();
    return instance.state.get('menuOpen') && 'menu-open';
  },
  cordova() {
    return Meteor.isCordova && 'cordova';
  },
  lists() {
    return [
      { name: 'Все',     id: "0"},
      { name: 'Пункт 1', id: "1"},
      { name: 'Пункт 2', id: "2"},
      { name: 'Пункт 3', id: "3"},
    ]
  },
  templateGestures: {
    'swipeleft .cordova'(event, instance) {
      instance.state.set('menuOpen', false);
    },
    'swiperight .cordova'(event, instance) {
      instance.state.set('menuOpen', true);
    },
  },

  activeListClass(listId) {
    const active = ActiveRoute.name('Lists.show')
        && FlowRouter.getParam('id') === listId;

    return active && 'active';
  },

  todosLength(listId){
    return Template.instance().getTodosListLenght(listId);
  }

});

Template.App_body.events({
  'click .js-menu'(event, instance) {
    instance.state.set('menuOpen', !instance.state.get('menuOpen'));
  },
  'click .content-overlay'(event, instance) {
    instance.state.set('menuOpen', false);
    event.preventDefault();
  },
  'click #menu a'(event, instance) {
    instance.state.set('menuOpen', false);
  },

  'click .js-user-menu'(event, instance) {
    instance.state.set('userMenuOpen', !instance.state.get('userMenuOpen'));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

});
