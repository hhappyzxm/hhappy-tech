define('angular-index', ['app'], function(app){
    'use strict';


    /**
     * Example/Auto-Start
     * */
    app.run(function ($templateCache) {
        $templateCache.put('example/auto-start',
            '<!DOCTYPE html>\n' +
            '<html ng-app="demoApp">\n' +
            '   ...\n' +
            '</html>');
    });

    /**
     * Example/Manual-Start
     * */
    app.run(function ($templateCache) {
        $templateCache.put('example/manual-start',
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '   ...\n' +
            '</head>\n' +
            '<body>\n' +
            '   ...\n' +
            '   <script>\n' +
            '       angular.element(document).ready(function(){\n' +
            '           angular.bootstrap(document, [\'demoApp\']);\n' +
            '       });\n' +
            '   </script>\n' +
            '</body>\n' +
            '</html>');
    });

    return app;
});