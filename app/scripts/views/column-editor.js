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

        anchor: null,

        initialize: function (options) {
            console.dir({'ColumnEditorView.initialize': options});
            this.anchor = $('#app');
            this.backup();
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

        backup: function(){
            this.anchor.append(this.el);
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
                this.backup();
                this.model.set('title', this.$('.input_title').val());
                this.model.trigger('released');
                // this.$el.trigger('column.saved', this.model);
            }
        },

        cancelColumnClicked: function(){
            this.backup();
            if(this.model){
                this.model.trigger('released');
                if(this.isEmpty()){
                    this.model.trigger('deleted');
                }
            }

        }

    });

    return ColumnEditorView;
});
