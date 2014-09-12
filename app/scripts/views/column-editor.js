/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var ColumnEditorView = Backbone.View.extend({
        template: JST['app/scripts/templates/column-editor.ejs'],

        tagName: 'div',

        id: '',

        className: 'column_editor',

        events: {
            'click .btn_save_column': 'saveColumnClicked',
            'click .btn_cancel_column': 'cancelColumnClicked'
        },

        initialize: function () {
        },

        setModel: function(model) {
            if(this.model){
                this.stopListening(this.model);
            }

            this.model = model;

            if(this.model){
                this.listenTo(this.model, 'change', this.render);
                this.model.trigger('change');
            }

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.delegateEvents(this.events);
        },

        isEmpty: function(){
            return !this.model || this.model.isEmpty();
        },

        validateForm: function(){
            var val = this.$('.input_title').val();
            val.replace(/(^\s+)|(\s+$)/g, '');
            var valid = val.length;
            this.$('.input_title').toggleClass('invalid', !valid);
            return valid;
        },

        saveColumnClicked: function(){
            if(this.validateForm()){
                this.$el.trigger('column.resolved', this.model);
                this.$el.trigger('column.saved', this.model);
                this.model.set('title', this.$('.input_title').val());
            }
        },

        cancelColumnClicked: function(){
            if(this.isEmpty()){
                this.$el.trigger('column.deleted', this.model);
            }
            this.$el.trigger('column.resolved', this.model);

        }

    });

    return ColumnEditorView;
});
