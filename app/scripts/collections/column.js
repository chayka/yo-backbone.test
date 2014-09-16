/*global define*/

define([
    'underscore',
    'backbone',
    'models/column',
    'collections/double-linked-list'
], function (_, Backbone, ColumnModel, DoubleLinkedList) {
    'use strict';

    var ColumnCollection = DoubleLinkedList.extend({
        model: ColumnModel
    });

    return ColumnCollection;
});
