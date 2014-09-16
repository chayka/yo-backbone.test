/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/task-li', 'models/task', 'jquery-ui/ui/sortable'
], function ($, _, Backbone, JST, TaskLiView) {
    'use strict';

    var ColumnView = Backbone.View.extend({
        template: JST['app/scripts/templates/column.ejs'],

        tagName: 'div',

        id: '',

        className: 'column',

        events: {
            'dblclick .title': 'editColumnClicked',
            'click .btn_add_task': 'addTaskClicked',
            'click .btn_json': 'jsonClicked',
            'click .btn_delete_column': 'deleteColumnClicked'
        },

        tasks: null,

        initialize: function () {
            if (this.model) {

                this.tasks = {};

                this.listenTo(this.model, 'change', this.render);
                this.model.on('released', $.proxy(this.releaseColumn, this));
                this.model.on('deleted', $.proxy(this.deleteColumn, this));
                this.listenTo(this.model.tasks, 'add', this.renderTask);
                this.listenTo(this.model.tasks, 'remove', $.proxy(this.removeTaskView, this));
                this.listenTo(this.model.tasks, 'move', $.proxy(this.moveTask, this));
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
            this.$el.data('columnId', this.model.cid);
            this.renderTasks();
            var empty = this.isEmpty();
            this.$el.toggleClass('empty', empty);
            this.$('.tasks').sortable({
                connectWith: '.tasks',
                placeholder: 'placeholder',
                stop: $.proxy(this.onTaskDropped, this)
            });
            return this;
        },

        isEmpty: function(){
            return !this.model || this.model.isEmpty();
        },

        attachColumnEditor: function(editor){
            this.$('.title').after(editor.el);
            editor.$('.input_title').focus();
        },

        addTaskClicked: function() {
            // console.dir({'args':arguments, 'this': this});
            // var task = new TaskModel({
            //     board: this.model.get('board'),
            //     column: this.model.cid
            // });
            // this.model.tasks.add(task);
            this.$el.trigger('task.add', this.model);
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
            this.getTaskView(task).render();
            this.moveTask(task);
            // this.$('.tasks').append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        renderTasks: function() {
            this.model.tasks.each(this.renderTask, this);
        },

        onTaskRemove: function(e, task){
            console.dir({args: arguments, this: this});
            e.stopPropagation();
            this.model.tasks.withdraw(task);
            this.$el.trigger('storedata');
        },

        moveTask: function(task){
            var taskView = this.getTaskView(task),
                afterId = task.prevId;

            if(afterId){
                var afterTask = this.model.tasks.get(afterId),
                    afterView = this.getTaskView(afterTask);
                afterView.$el.after(taskView.el);
            }else{
                this.$('.tasks').prepend(taskView.el);
            }
        },

        onTaskDropped: function(e, ui){
            var fromColumnId = $(e.target).parent().data('columnId'),
                toColumnId = ui.item.parent().parent().data('columnId'),
                afterId = ui.item.prev().data('taskId') || 'head',
                taskId = ui.item.data('taskId');

            if(fromColumnId === toColumnId){
                if(toColumnId === this.model.cid){
                    this.model.tasks.move(taskId, afterId);
                }
            }else{
                var task = this.model.tasks.get(taskId);
                this.sendTask(task, toColumnId, afterId);
            }

            console.dir({
                fromColumnId: fromColumnId,
                toColumnId: toColumnId,
                afterId: afterId,

                cid: this.model.get('title'),
                e: e,
                ui: ui
            });
            this.$el.trigger('storedata');
        },

        sendTask: function(task, toColumnId, afterId){
            var view = this.getTaskView(task);
            this.model.tasks.withdraw(task.cid);
            this.$el.trigger('task.send', [task, view, toColumnId, afterId]);
        },

        deleteColumn: function(){
            this.$el.trigger('column.deleted', this.model);
        },

        releaseColumn: function(){
            this.$el.trigger('column.released', this.model);
        },

        editColumnClicked: function(){
            this.$el.trigger('column.edit', this.model);
        },

        deleteColumnClicked: function(){
            this.deleteColumn();
        },

        jsonClicked: function(){
            console.dir({
                jsonClicked:{
                    'columnView': this,
                    'column': this.model,
                    'columnJSON': this.model.toJSON(),
                    'tasks':this.model.tasks.models,
                    'tasksJSON': this.model.tasks.toJSON()
                }
            });
        }



    });

    return ColumnView;
});
