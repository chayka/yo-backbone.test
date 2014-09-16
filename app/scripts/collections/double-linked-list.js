/*global define*/

define([
	'underscore',
	'backbone',
], function(_, Backbone) {
	'use strict';

	var DoubleLinkedListCollection = Backbone.Collection.extend({

		headId: null,

		tailId: null,

		pointerId: null,

		insert: function(model, after, isMove) {
			var head = this.headId ? this.get(this.headId) : null,
				tail = this.tailId ? this.get(this.tailId) : null,
				prev = null,
				next = null;
			if (after) {
				if ('head' === after) { // adding item at the beginning
					prev = null;
					next = head;
				} else { // adding item after specified Id
					prev = this.get(after) || tail;
					next = prev && prev.nextId ? this.get(prev.nextId) : null;
				}
			} else { // adding at the end of the list
				prev = tail;
				next = null;
			}

			if (prev) { // inserting not as a head
				prev.nextId = model.cid;
				model.prevId = prev.cid;
			} else { // inserting as a head
				this.headId = model.cid;
				model.prevId = null;
			}

			if (next) { // inserting not as a tail
				next.prevId = model.cid;
				model.nextId = next.cid;
			} else { // inserting as a tail
				this.tailId = model.cid;
				this.nextId = null;
			}

			if (!isMove) {
				this.add(model);
			}

		},

		withdraw: function(id, isMove) {
			var model = this.get(id);
			if (model) {
				var prev = model.prevId ? this.get(model.prevId) : null,
					next = model.nextId ? this.get(model.nextId) : null;

				model.prevId = null;
				model.nextId = null;

				if (prev) { // model is not a head
					prev.nextId = next ? next.cid : null;
				} else { // model is a head
					this.headId = next ? next.cid : null;
				}

				if (next) { // model is not a tail
					next.prevId = prev ? prev.cid : null;
				} else { // model is a tail
					this.tailId = prev ? prev.cid : null;
				}
				if (!isMove) {
					this.remove(model);
				}
			}
			return model;
		},

		move: function(id, after) {
			var model = this.withdraw(id, true);
			if (model) {
				this.insert(model, after, true);
				this.trigger('move', model);
			}
		},

		isLinked: function(){
			var size = this.size();
			return !size && !this.headId && !this.tailId || size && this.headId && this.tailId;
		},

		linkList: function(){
			var prev = null;
			_.each(this.models, function(model){
				
				if(!this.headId){
					this.headId = model.cid;
				}

				this.tailId = model.cid;

				if(prev){
					model.prevId = prev.cid;
					prev.nextId = model.cid;
				}else{
					model.prevId = null;
				}

				model.nextId = null;

				prev = model;

			}, this);
		},

		each: function(iteratee, context){
			if(!this.isLinked()){
				this.linkList();
			}

			var currentId = this.headId,
				model = null,
				i = 0;

			while(currentId && (model = this.get(currentId))){
				iteratee.call(context, model, currentId, this.models);
				currentId = model.nextId;
				i++;
			}
		},

		toJSON: function(){
			var result = [];

			this.each(function(model){
				result.push(model.toJSON());
			}, this);
			
			return result;
		}

	});

	return DoubleLinkedListCollection;
});