(function (module) {
    'use strict';

    var serviceId = 'JobsFactory';

    module.factory(serviceId, ['$resource', jobsfactory]);

    function jobsfactory($resource) {
        return $resource('http://pipes.yahoo.com/pipes/pipe.run?_id=9cb44301dcece96db1d28de6959bd25c&_render=json', {}, {
            getJobs: { method: 'GET'}
        });

        //#region Internal Methods        

        //#endregion
    }
})(angular.module('app'));