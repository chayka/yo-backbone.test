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
        },

        toJSON: function(){
            var res = $.extend({}, this.attributes);
            res.columns = this.columns.toJSON();
            return res;
        },

        fromJSON: function(json){
            for(var col in json.columns){
                var column = new ColumnModel();
                column.boardId = this.cid;
                column.fromJSON(json.columns[col]);
                this.columns.insert(column);
            }
            this.set(_.omit(json, 'columns'));
        }


    });

    return BoardModel;
});
