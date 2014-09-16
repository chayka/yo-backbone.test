/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
        // scroolly: {
        //     deps: ['jquery']
        // }
    },
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'jquery-ui': '../bower_components/jquery-ui',
        'backbone': '../bower_components/backbone/backbone',
        'underscore': '../bower_components/lodash/dist/lodash',
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'scroolly': '../bower_components/jquery.scroolly/src/jquery.scroolly'
    }
});

require([
    'backbone'
], function (Backbone) {
    Backbone.history.start();
});


require(['scrolls']);

require(['app']);

// var boardRouter = new BoardRouter();