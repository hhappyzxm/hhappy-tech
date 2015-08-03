define('app', ['angular', 'angular-bootstrap', 'angular-hljs'], function (angular) {
    'use strict';

    /**
     * Config Module
     */
    angular.module('app.config', []).
        constant('config', {
            siteTitle: 'Tech',
            siteRootUri: '../home',
            modules: [
                {
                    order: 1,
                    key: 'jquery',
                    name: 'jQuery',
                    src: '../jquery'
                    //desc: 'AngularJS是一款优秀的前端JS框架，它有很多优秀的特性如：MVVM、模块化、自动双向数据绑定、语义化标签、依赖注入等等'
                },
                {
                    order: 2,
                    key: 'angular',
                    name: 'AngularJS',
                    src: '../angular'
                    //desc: 'AngularJS是一款优秀的前端JS框架，它有很多优秀的特性如：MVVM、模块化、自动双向数据绑定、语义化标签、依赖注入等等'
                },
                {
                    order: 3,
                    key: 'icons',
                    name: 'Icons',
                    src: '../icons',
                    desc: 'Glyphicons & Font Awesome'
                }
            ]
        }).
        service('configService', function(config){
            this.getModule = function(key){
                for (var i = 0; i < config.modules.length; i++) {
                    if (angular.equals(angular.lowercase(config.modules[i].key), angular.lowercase(key))) {
                        return config.modules[i];
                    }
                }
            };
        });

    /**
     * Directives Module
     */
    angular.module('app.directives', ['app.config', 'app.directives.header', 'app.directives.footer', 'app.directives.sideMenu']);

    /**
     * Header Directive
     */
    angular.module('app.directives.header', ['app.config']).
        directive('headerBody', function (config, configService) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'template/header-body.html',
                scope: {
                    moduleKey: '@'
                },
                link: function (scope, element, attrs) {
                    if (angular.isUndefined(scope.moduleKey)) {
                        scope.title = config.siteTitle;
                    }
                    else {
                        var module = configService.getModule(scope.moduleKey);
                        scope.title = module.name;
                        scope.desc = module.desc;
                    }

                    scope.siteRootUri = config.siteRootUri;
                    scope.siteTitle = config.siteTitle;
                    scope.modules = config.modules;
                }
            };
        }).
        run(function ($templateCache) {
            $templateCache.put('template/header-body.html',
                '<div role="header">\n' +
                '   <header class="navbar navbar-default bs-nav">\n' +
                '       <div class="container">\n' +
                '           <nav>\n' +
                '               <a class="navbar-brand" ng-href="{{siteRootUri}}">{{siteTitle}}</a>\n' +
                '               <ul class="nav navbar-nav">\n' +
                '                   <li ng-repeat="module in modules" ng-class="{true:\'active\'}[module.key == moduleKey]">\n' +
                '                       <a ng-href="{{module.src}}">{{module.name}}</a>' +
                '                   </li>\n' +
                '               </ul>\n' +
                '               <ul class="nav navbar-nav navbar-right">\n' +
                '                   <li><a href="https://github.com/mingstudio/ming-tech" target="_blank"><i class="fa fa-github"></i>&nbsp;Git Hub</a></li>' +
                '               </ul>\n' +
                '           </nav>\n' +
                '       </div>\n' +
                '   </header>' +
                '   <header class="bs-header text-center">\n' +
                '       <div class="container">\n' +
                '           <h1>{{title}}</h1>\n' +
                '           <p>{{desc}}</p>\n' +
                '       </div>\n' +
                '   </header>\n' +
                '<div>\n'
            );
        });

    /**
     * Footer Directive
     */
    angular.module('app.directives.footer', []).
        directive('footerBody', function () {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'template/footer-body.html'
            };
        }).
        run(function ($templateCache) {
            $templateCache.put('template/footer-body.html',
                '<footer class="footer">\n' +
                '   <div class="container">\n' +
                '   </div>\n' +
                '</footer>');
        });

    /**
     * Side Menu Directive
     */
    angular.module('app.directives.sideMenu', []).
        service('sideMenuService', function () {
            var menuRoot = {
                id: 'sidemenu-0',
                level: 0,
                parent: null,
                items: []
            };
            var currentMenu = menuRoot;
            var getTarget = function (parentId, menuItem) {
                if (parentId == menuItem.id) {
                    return menuItem;
                }
                else {
                    for (var i = 0; i < menuItem.items.length; i++) {
                        return getTarget(menuItem.items[i]);
                    }
                }
            };
            this.addTarget = function (name, level) {
                if (currentMenu.level != level - 1) {
                    currentMenu = currentMenu.parent;
                }

                var newMenu = {
                    id: currentMenu.id + "-" + currentMenu.items.length,
                    name: name,
                    level: level,
                    parent: currentMenu,
                    items: []
                };
                currentMenu.items.push(newMenu);
                currentMenu = newMenu;

                return newMenu;
            };
            this.getMenuRoot = function () {
                return menuRoot;
            };

            var currentActiveMenuEls = [];
            this.getActiveMenuEls = function () {
                return currentActiveMenuEls;
            };
        }).
        directive('sideMenu', function (sideMenuService) {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'template/side-menu.html',
                scope: {},
                controller: function ($scope) {
                    $scope.menuRoot = sideMenuService.getMenuRoot();

                    $scope.active = function (event, menu) {
                        var
                            el = angular.element(event.target),
                            activeEls = sideMenuService.getActiveMenuEls();

                        for (var i = 0; i < activeEls.length; i++) {
                            var item = activeEls[i];
                            if (item.level >= menu.level) {
                                item.el.removeClass('active');
                                activeEls.splice(i, 1);
                                i--;
                            }
                        }

                        el.parent().addClass('active');
                        activeEls.push({
                            level: menu.level,
                            el: el.parent()
                        });
                    }
                }
            };
        }).
        directive('sideMenuLevel', function (sideMenuService) {
            return {
                restrict: 'A',
                replace: false,
                scope: {
                    sideMenuLevel: '@'
                },
                link: function (scope, element) {
                    var newMenu = sideMenuService.addTarget(element.html(), scope.sideMenuLevel);
                    element.attr('id', newMenu.id);
                }
            };
        }).
        run(function ($templateCache) {
            $templateCache.put('template/side-menu.html',
                '<nav class="bs-sidebar" bs-affix>\n' +
                '   <ul class="nav bs-sidenav">\n' +
                '       <li ng-repeat="menu in menuRoot.items">\n' +
                '           <a ng-href="#{{menu.id}}" ng-click="active($event, menu)">{{menu.name}}</a>\n' +
                '           <ul class="nav" ng-if="menu.items.length > 0">' +
                '               <li ng-repeat="childMenu in menu.items">' +
                '                   <a ng-href="#{{childMenu.id}}" ng-click="active($event, childMenu)">{{childMenu.name}}</a>' +
                '               </li>' +
                '           </ul>\n' +
                '       </li>\n' +
                '   </ul>\n' +
                '</nav>'
            );
        });

    /**
     * Init app for each page
     */
    return angular.module('app', ['ui.bootstrap', 'app.config', 'app.directives', 'hljs']);
});