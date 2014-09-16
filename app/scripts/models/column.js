/*global define*/

define([
    'underscore',
    'backbone',
    'models/task', 'collections/task'
], function (_, Backbone, TaskModel, TaskCollection) {
    'use strict';

    var ColumnModel = Backbone.Model.extend({
        url: '',

        nextId: null,

        prevId: null,

        tasks: null,

        boardId: null,

        initialize: function() {
            this.tasks = new TaskCollection();
        },

        defaults: {
            title: ''
        },

        validate: function(attrs, options) {
            console.dir({'column.validate':{'attrs':attrs, 'options':options}});
        },

        parse: function(response, options)  {
            console.dir({'column.parse':{'options':options}});
            return response;
        },

        isEmpty: function(){
            return !this.get('title') && !this.tasks.size();
        },

        toJSON: function(){
            var res = $.extend({}, this.attributes);
            res.tasks = this.tasks.toJSON();
            return res;
        },

        fromJSON: function(json){
            this.tasks.set(json.tasks);
            this.tasks.each(function(task){
                task.columnId = this.cid;
                task.boardId = this.boardId;
            }, this);
            this.set(_.omit(json, 'tasks'));
        }

    });

    return ColumnModel;
});
