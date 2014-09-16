/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var TaskModel = Backbone.Model.extend({
        url: '',

        nextId: null,

        prevId: null,

        boardId: null,

        columnId: null,

        defaults: {
            content: '',
        },



        initialize: function() {
        },

        validate: function(attrs, options) {
            console.dir({'task.validate':{'attrs':attrs, 'options':options}});
        },

        parse: function(response, options)  {
            console.dir({'task.parse':{'options':options}});
            return response;
        },

        isEmpty: function(){
            return !this.get('content');
        }

        // isHomeless: function(){
        //     return !this.get('board') || !this.get('column');
        // }

    });

    return TaskModel;
});
