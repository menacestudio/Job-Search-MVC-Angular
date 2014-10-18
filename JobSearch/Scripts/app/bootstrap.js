(function () {
    'use strict';

    var id = 'app';

    // Create the module and define its dependencies.
    var bootstrap = angular.module(id, [
        // Angular modules 
        'ngAnimate',  // animations
        'ngRoute',    // routing
        'ngResource', // resource
        'ngSanitize', // sanitize
        'ngCookies',           // cookies
        'ui.bootstrap'
    ]);

    // Execute bootstrapping code and any dependencies.
    bootstrap.run(['$q', '$rootScope',
        function ($q, $rootScope) {

        }]);
})();