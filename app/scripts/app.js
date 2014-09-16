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
) {

	var modified = false;

	var board = new BoardView({
		model: new BoardModel()
	});

	var storeData = function() {
		var json = board.model.toJSON(),
			data = JSON.stringify(json);

		localStorage.setItem('board', data);
		console.dir({
			'data stored': {
				json: json,
				string: data
			}
		});
	};

	board.$el.appendTo('#app');

	var defaultData = {
		columns: [
			{title: 'To Do'},
			{title: 'Doing'},
			{title: 'Done'}
		]
	};

	if (Modernizr.localstorage) {
		// Code for localStorage/sessionStorage.
		var data = localStorage.getItem('board');
		if (data) {
			console.dir({
				data: data
			});
			data = JSON.parse(data);
		}else{
			data = defaultData;
		}

		setInterval(function() {
			if (modified) {
				storeData();
			}
			modified = false;
		}, 1000);

		$('#app').on('storedata', function() {
			console.log('store signal received');
			modified = true;
		});

	} else {
		// Sorry! No Web Storage support..
		data = defaultData;
		console.info('no localStorage support');

	}

	board.model.fromJSON(data);
	board.resizeBoard();


});