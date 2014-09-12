/*global define*/

define([
    'underscore',
    'backbone',
    'models/column'
], function (_, Backbone, ColumnModel) {
    'use strict';

    var ColumnCollection = Backbone.Collection.extend({
        model: ColumnModel
    });

    return ColumnCollection;
});
