/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        modernizr:{
            exports: 'Modernizr'
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
        'modernizr': '../bower_components/modernizr/modernizr',
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap'
    }
});

// require([
//     'backbone'
// ], function (Backbone) {
//     Backbone.history.start();
// });


require(['app']);

// var boardRouter = new BoardRouter();