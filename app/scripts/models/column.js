/*global define*/

define([
    'underscore',
    'backbone',
    'models/task', 'collections/task'
], function (_, Backbone, TaskModel, TaskCollection) {
    'use strict';

    var ColumnModel = Backbone.Model.extend({
        url: '',

        tasks: null,

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

    });

    return ColumnModel;
});
