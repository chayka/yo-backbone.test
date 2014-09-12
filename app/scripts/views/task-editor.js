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

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return TaskEditorView;
});
