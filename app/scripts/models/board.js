/*global define*/

define([
    'underscore',
    'backbone',
    'models/column', 'collections/column'
], function (_, Backbone, ColumnModel, ColumnCollection) {
    'use strict';

    var BoardModel = Backbone.Model.extend({
        url: '',

        columns: null,

        initialize: function() {
            this.columns = new ColumnCollection();
        },

        defaults: {
        },

        validate: function(attrs, options) {
            console.dir({'board.validate':{'attrs':attrs, 'options':options}});
        },

        parse: function(response, options)  {
            console.dir({'board.parse':{'options':options}});
            return response;
        }
    });

    return BoardModel;
});
