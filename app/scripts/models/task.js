/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var TaskModel = Backbone.Model.extend({
        url: '',

        initialize: function() {
        },

        defaults: {
            content: ''
        },

        validate: function(attrs, options) {
            console.dir({'task.validate':{'attrs':attrs, 'options':options}});
        },

        parse: function(response, options)  {
            console.dir({'task.parse':{'options':options}});
            return response;
        }
    });

    return TaskModel;
});
