import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Lists } from '../../api/lists/lists.js';

//import { listRenderHold } from '../launch-screen.js';
import './lists-show-page.html';

// Components used inside the template
import './app-not-found.js';
import '../components/lists-show.js';
import '../components/all-lists-show.js';

Template.Lists_show_page.onCreated(function listsShowPageOnCreated() {
  this.getListId = () => FlowRouter.getParam('id');

  this.autorun(() => {
    this.subscribe('todos.inList', { listId: this.getListId() });
  });
});

Template.Lists_show_page.onRendered(function listsShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {

    }
  });
});

Template.Lists_show_page.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes.
  listIdArray() {
    const instance = Template.instance();
    const listId = instance.getListId();
    return Lists.findOne(listId) ? [listId] : [];
  },

  listsArray(){
    return Lists.all();
  },

  showAllLists(){
    const instance = Template.instance();
    const listId = instance.getListId();
    return listId === '0';
  },

  listArgs(listId) {
    const instance = Template.instance();
    const list = Lists.findOne(listId);
    const todos = list && Lists.todos(listId);
    return {
      todosReady: instance.subscriptionsReady(),
      list() {
        return Lists.findOne(listId);
      },
//      todos,
    };
  },

  listsArgs(lists) {
    return {
      lists() {
        return lists;
      },
    };
  },
});