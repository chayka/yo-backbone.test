/*global define*/

define([
    'underscore',
    'backbone',
    'models/task'
], function (_, Backbone, TaskModel) {
    'use strict';

    var TaskCollection = Backbone.Collection.extend({
        model: TaskModel
    });

    return TaskCollection;
});
