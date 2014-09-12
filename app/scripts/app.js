'use strict';
define([
	'jquery', 'backbone', 'underscore',
	// 'models/column', 'collections/column',
	// 'models/task', 'collections/task',
	'models/board', 'views/board'
], function(
	$, Backbone, _,
	// ColumnModel, ColumnCollection,
	// TaskModel, TaskCollection,
	BoardModel, BoardView
){
	var board = new BoardView({
		model: new BoardModel()
	});

	board.$el.appendTo('#app');

});