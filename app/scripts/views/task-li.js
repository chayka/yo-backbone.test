/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TaskLiView = Backbone.View.extend({
        template: JST['app/scripts/templates/task-li.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click .btn_delete': 'deleteTaskClicked'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        },

        deleteTaskClicked: function(){
            this.$el.trigger('task.deleted', this.model);
        }
    });

    return TaskLiView;
});
