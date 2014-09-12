/*global define*/
define(['jquery', 'underscore', 'backbone', 'templates', 'models/column', 'views/column', 'views/column-editor'],
    function($, _, Backbone, JST, ColumnModel, ColumnView, ColumnEditor) {
    'use strict';
    var BoardView = Backbone.View.extend({

        template: JST['app/scripts/templates/board.ejs'],

        tagName: 'div',

        id: '',

        className: 'board',

        events: {
            'click .btn_add_column': 'addColumnClicked'
        },

        columns: {},

        columnEditor: null,

        taskEditor: null,

        initialize: function() {
            this.$el.on('column.edit', $.proxy(this.onColumnEdit, this));
            this.$el.on('column.saved', $.proxy(this.onColumnSaved, this));
            this.$el.on('column.deleted', $.proxy(this.onColumnRemove, this));
            this.$el.on('column.resolved', $.proxy(this.onColumnResolve, this));
            this.columnEditor = new ColumnEditor();
            this.$el.append(this.columnEditor.el);
            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model.columns, 'add', this.renderColumn);
                this.listenTo(this.model.columns, 'remove', $.proxy(this.removeColumnView, this));
                this.listenTo(this.model.columns, 'reset', $.proxy(this.renderColumns, this));
                this.render();
            }
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.renderColumns();
        },

        // backupColumnEditor: function(){
        //     this.$el.append(this.columnEditor.el);
            
        // }

        getColumnView: function(column) {
            var view = _.has(this.columns, column.cid) && this.columns[column.cid] ?
                this.columns[column.cid] :
                (this.columns[column.cid] = new ColumnView({model: column}));
            return view;
        },

        removeColumnView: function(column) {
            if (_.has(this.columns, column.cid) && this.columns[column.cid]) {
                this.columns[column.cid].remove();
                this.columns[column.cid] = null;
            }
        },

        renderColumn: function(column) {
            var view = this.getColumnView(column);
            this.$('.columns').append(view.render().el);
            if(this.$el.is('.adding_column') && column.isEmpty()){
                this.columnEditor.setModel(column);
                view.$('.title').after(this.columnEditor.el);
            }
        },

        // Add all items in the **Todos** collection at once.
        renderColumns: function() {
            this.model.columns.each(this.renderColumn, this);
        },

        addColumnClicked: function() {
            console.dir({'args':arguments, 'this': this});
            this.$el.addClass('adding_column');
            var colWidth = this.$('.btn_add_column').outerWidth();
            this.$el.css('width', colWidth * (this.model.columns.size()+1)+'px');
            this.columnEditor.cancelColumnClicked();

            var column = new ColumnModel({board: this.model.cid});
            this.model.columns.add(column);
        },

        onColumnEdit: function(e, column){
            e.stopPropagation();
            // this.$el.removeClass('adding_column');
            this.columnEditor.cancelColumnClicked();
            var view = this.getColumnView(column);
            this.columnEditor.setModel(column);
            view.$('.title').after(this.columnEditor.el);
            view.$el.addClass('edit');
        },

        onColumnSaved: function(e, column){
            console.dir({args: arguments, this: this, c: column});
            e.stopPropagation();
        },

        onColumnResolve: function(e, column){
            console.dir({args: arguments, this: this});
            e.stopPropagation();
            this.$el.removeClass('adding_column');
            var view = this.getColumnView(column);
            view.$el.removeClass('empty edit');
            this.$el.append(this.columnEditor.el);
        },

        onColumnRemove: function(e, column){
            console.dir({args: arguments, this: this});
            e.stopPropagation();
            this.model.columns.remove(column);
        }

    });

    return BoardView;
});