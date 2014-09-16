/*global define*/
define(['jquery', 'underscore', 'backbone', 'templates',
    'models/column', 'views/column', 'views/column-editor', 'models/task', 'views/task-editor', 'jquery-ui/ui/sortable'],
    function($, _, Backbone, JST, ColumnModel, ColumnView, ColumnEditor, TaskModel, TaskEditor) {
    'use strict';
    var BoardView = Backbone.View.extend({

        template: JST['app/scripts/templates/board.ejs'],

        tagName: 'div',

        id: '',

        className: 'board',

        events: {
            'click .btn_add_column': 'addColumnClicked'
        },

        columns: null,

        columnEditor: null,

        taskEditor: null,

        initialize: function() {
            this.$el.on('column.edit', $.proxy(this.onColumnEdit, this));
            this.$el.on('column.deleted', $.proxy(this.onColumnRemove, this));
            this.$el.on('column.released', $.proxy(this.onColumnRelease, this));

            this.$el.on('task.add', $.proxy(this.onTaskAdd, this));
            this.$el.on('task.edit', $.proxy(this.onTaskEdit, this));
            this.$el.on('task.send', $.proxy(this.onTaskSend, this));

            this.columns = {};

            this.columnEditor = new ColumnEditor();

            this.taskEditor = new TaskEditor();
            this.taskEditor.on('save', $.proxy(this.onTaskSave, this));
            this.taskEditor.on('cancel', $.proxy(this.onTaskCancel, this));

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model.columns, 'add', this.renderColumn);
                this.listenTo(this.model.columns, 'remove', $.proxy(this.removeColumnView, this));
                this.listenTo(this.model.columns, 'move', $.proxy(this.moveColumn, this));
                this.listenTo(this.model.columns, 'reset', $.proxy(this.renderColumns, this));
                this.render();
            }
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.renderColumns();
            this.$('.columns').sortable({
                connectWith: '.columns',
                placeholder: 'placeholder',
                stop: $.proxy(this.onColumnDropped, this)
                // axis: 'x'
            });
            this.resizeBoard();
        },

        resizeBoard: function(){
            var colWidth = 310,
                btnWidth = this.$('.btn_add_column').outerWidth();
            this.$el.css('width', (colWidth * this.model.columns.size() + btnWidth)+'px');
        },

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
            // this.$('.columns').append(view.render().el);
            this.moveColumn(column);

            if(column.isEmpty()){
                this.columnEditor.setModel(column);
                view.attachColumnEditor(this.columnEditor);
            }
        },

        // Add all items in the **Todos** collection at once.
        renderColumns: function() {
            this.model.columns.each(this.renderColumn, this);
        },

        addColumnClicked: function() {
            // console.dir({'args':arguments, 'this': this});
            this.columnEditor.cancelColumnClicked();
            this.$el.addClass('adding_column');

            var column = new ColumnModel();
            column.boardId = this.model.cid;
            this.model.columns.insert(column);
            this.resizeBoard();
        },

        onColumnEdit: function(e, column){
            e.stopPropagation();
            // this.$el.removeClass('adding_column');
            this.columnEditor.cancelColumnClicked();
            var view = this.getColumnView(column);
            this.columnEditor.setModel(column);
            view.attachColumnEditor(this.columnEditor);
            view.$el.addClass('edit');
        },

        onColumnRelease: function(e, column){
            // console.dir({args: arguments, this: this});
            e.stopPropagation();
            this.$el.removeClass('adding_column');
            var view = this.getColumnView(column);
            view.$el.removeClass('edit');
            this.$el.trigger('storedata');
            // this.$el.append(this.columnEditor.el);
        },

        onColumnRemove: function(e, column){
            console.dir({args: arguments, this: this});
            e.stopPropagation();
            var view = this.getColumnView(column);
            if(view.$('.column_editor').length){
                this.columnEditor.backup();
            }
            this.model.columns.withdraw(column);
            this.resizeBoard();
            this.$el.trigger('storedata');
        },

        onTaskAdd: function(e, column){
            e.stopPropagation();
            var task = new TaskModel();
            task.boardId = this.model.cid;
            task.columnId = column.cid;
            var view = this.getColumnView(column);
            this.taskEditor.cancelTaskClicked();
            this.taskEditor.setModel(task);
            view.$el.addClass('adding_task').append(this.taskEditor.el);
            this.taskEditor.$('.input_content').focus();
        },

        onTaskEdit: function(e, task){
            e.stopPropagation();
            var colId = task.columnId;
            var column = this.model.columns.get(colId);
            var colView = this.getColumnView(column);
            var taskView = colView.getTaskView(task);
            this.taskEditor.cancelTaskClicked();
            this.taskEditor.setModel(task);
            taskView.$el.hide().after(this.taskEditor.el);
            this.taskEditor.$('.input_content').focus();
        },

        onTaskSave: function(task){
            var colId = task.columnId;
            var column = this.model.columns.get(colId);
            var colView = this.getColumnView(column);
            if(column.tasks.get(task.cid)){
                var taskView = colView.getTaskView(task);
                taskView.$el.show();
            }else{
                column.tasks.insert(task);
            }
            colView.$el.removeClass('adding_task');
            this.$el.trigger('storedata');
        },

        onTaskCancel: function(task){
            var colId = task.columnId;
            var column = this.model.columns.get(colId);
            if(column){
                var colView = this.getColumnView(column);
                colView.$el.removeClass('adding_task');
                if(column.tasks.get(task)){
                    var taskView = colView.getTaskView(task);
                    taskView.$el.show();
                }
            }
        },

        onTaskSend: function(e, task, taskView, columnId, afterId){
            var colView = this.columns[columnId];
            colView.tasks[task.cid] = taskView;
            colView.model.tasks.insert(task, afterId);
            task.columnId = columnId;
            // colView.getTaskView(task).render();
            console.dir({'onTaskSend': this});
        },

        moveColumn: function(column){
            var columnView = this.getColumnView(column),
                afterId = column.prevId;

            if(afterId){
                var afterColumn = this.model.columns.get(afterId),
                    afterView = this.getColumnView(afterColumn);
                afterView.$el.after(columnView.el);
            }else{
                this.$('.columns').prepend(columnView.el);
            }
        },

        onColumnDropped: function(e, ui){
            var afterId = ui.item.prev().data('columnId') || 'head',
                columnId = ui.item.data('columnId');

            this.model.columns.move(columnId, afterId);
            this.$el.trigger('storedata');
        },



    });

    return BoardView;
});