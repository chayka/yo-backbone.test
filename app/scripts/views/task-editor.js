/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TaskEditorView = Backbone.View.extend({
        template: JST['app/scripts/templates/task-editor.ejs'],

        tagName: 'div',

        id: '',

        className: 'task_editor',

        events: {
            'click .btn_save_task': 'saveTaskClicked',
            'click .btn_cancel_task': 'cancelTaskClicked'
        },

        anchor: null,

        initialize: function (options) {
            console.dir({'TaskEditorView.initialize': options});
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
            this.setupResizableTextarea();
        },

        isEmpty: function(){
            return !this.model || this.model.isEmpty();
        },

        backup: function(){
            this.anchor.append(this.el);
        },

        validateForm: function(){
            var val = this.$('.input_content').val();
            val.replace(/(^\s+)|(\s+$)/g, '');
            var valid = val.length;
            this.$('.input_content').toggleClass('invalid', !valid);
            return valid;
        },

        saveTaskClicked: function(){
            if(this.validateForm()){
                this.backup();
                this.model.set('content', this.$('.input_content').val());
                this.trigger('save', this.model);
                // this.$el.trigger('column.saved', this.model);
            }
        },

        cancelTaskClicked: function(){
            this.backup();
            if(this.model){
                this.trigger('cancel', this.model);
                // this.model.trigger('released');
                // if(this.isEmpty()){
                //     this.model.trigger('deleted');
                // }
            }

        },

        resizeTextarea: function(){
            setTimeout($.proxy(function(){
                var textarea = this.$('.input_content');
                // textarea.css('height', 'auto');
                var height = textarea.css('box-sizing')==='border-box'?
                    parseInt(textarea.css('borderTopWidth')) +
//                    parseInt(textarea.css('paddingTop')) +
                    textarea.prop('scrollHeight')+
//                    parseInt(textarea.css('paddingBottom')) +
                    parseInt(textarea.css('borderBottomWidth')):
                    textarea.prop('scrollHeight');
                textarea.css('height', height+'px');
            }, this),0);
        },
                
        setupResizableTextarea: function() {
            var textarea = this.$('.input_content');
            textarea.bind('change input cut paste drop keydown',  $.proxy(this.resizeTextarea, this));
            this.resizeTextarea();
        }
   

    });

    return TaskEditorView;
});
