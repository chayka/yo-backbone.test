/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TaskLiView = Backbone.View.extend({
        template: JST['app/scripts/templates/task-li.ejs'],

        tagName: 'div',

        id: '',

        className: 'task',

        events: {
            'dblclick .content': 'editTaskClicked',
            'click .btn_delete': 'deleteTaskClicked'
        },

        initialize: function () {
            this.model.on('change', $.proxy(this.render, this));
            this.model.on('released', $.proxy(this.releaseTask, this));
            this.model.on('deleted', $.proxy(this.deleteTask, this));
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.data('taskId', this.model.cid);
            this.delegateEvents(this.events);

            return this;
        },

        releaseTask: function(){
            this.$el.trigger('task.released', this.model);
        },

        editTaskClicked: function(){
            this.$el.trigger('task.edit', this.model);
        },

        deleteTask: function(){
            this.$el.trigger('task.deleted', this.model);
        },

        deleteTaskClicked: function(){
            this.deleteTask();
        }

    });

    return TaskLiView;
});
