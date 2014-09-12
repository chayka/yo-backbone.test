'use strict';
require(['jquery', 'scroolly'], function($){
    $('h2').scroolly([
        {
            from: 'el-bottom',
            to: 'el-top',
            cssFrom: {
                opacity: '0.0'
            },
            cssTo: {
                opacity: '1.0'
            }
        }
    ]);
});