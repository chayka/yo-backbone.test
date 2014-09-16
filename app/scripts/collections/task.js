/*global define*/

define([
    'underscore',
    'backbone',
    'models/task',
    'collections/double-linked-list'
], function (_, Backbone, TaskModel, DoubleLinkedList) {
    'use strict';

    var TaskCollection = DoubleLinkedList.extend({
        model: TaskModel,

    });

    return TaskCollection;
});
