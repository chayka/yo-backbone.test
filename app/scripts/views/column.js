/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/task-li', 'models/task'
], function ($, _, Backbone, JST, TaskLiView, TaskModel) {
    'use strict';

    var ColumnView = Backbone.View.extend({
        template: JST['app/scripts/templates/column.ejs'],

        tagName: 'div',

        id: '',

        className: 'column',

        events: {
            'click .title': 'editColumnClicked',
            'click .btn_add_task': 'addTaskClicked',
            'click .btn_delete_column': 'deleteColumnClicked'
        },

        tasks: {},

        initialize: function () {
            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model.tasks, 'add', this.renderTask);
                this.listenTo(this.model.tasks, 'remove', $.proxy(this.removeTaskView, this));
                this.listenTo(this.model.tasks, 'reset', $.proxy(this.renderTasks, this));
                // this.$el.on('task.deleted', this.test);
                this.$el.on('task.deleted', $.proxy(this.onTaskRemove, this));
                // this.listenTo(this.model.tasks, 'all', $.proxy(this.render, this));
                this.render();
            }
        },

        // test: function(){
        //     console.dir({args: arguments, this: this});
        // },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.renderTasks();
            var empty = this.isEmpty();
            this.$el.toggleClass('empty', empty);
            return this;
        },

        isEmpty: function(){
            return !this.model || this.model.isEmpty();
        },

        addTaskClicked: function() {
            console.dir({'args':arguments, 'this': this});
            var task = new TaskModel({
                board: this.model.get('board'),
                column: this.model.cid
            });
            this.model.tasks.add(task);
        },

        getTaskView: function(task) {
            var view = _.has(this.tasks, task.cid) && this.tasks[task.cid] ?
                this.tasks[task.cid] :
                (this.tasks[task.cid] = new TaskLiView({model: task}));
            return view;
        },

        removeTaskView: function(task) {
            if (_.has(this.tasks, task.cid) && this.tasks[task.cid]) {
                this.tasks[task.cid].remove();
                this.tasks[task.cid] = null;
            }
        },

        renderTask: function(task) {
            var view = this.getTaskView(task);
            this.$('.tasks').append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        renderTasks: function() {
            this.model.tasks.each(this.renderTask, this);
        },

        onTaskRemove: function(e, task){
            console.dir({args: arguments, this: this});
            e.stopPropagation();
            this.model.tasks.remove(task);
        },

        deleteColumn: function(){
            this.$el.trigger('column.deleted', this.model);
        },

        editColumnClicked: function(){
            this.$el.trigger('column.edit', this.model);
        },

        deleteColumnClicked: function(){
            this.deleteColumn();
        }


    });

    return ColumnView;
});
