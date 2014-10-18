(function (module) {
    'use strict';

    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }
    
    var controllerId = 'JobsCtrl';

    module.controller(controllerId,
        ['$scope', '$window', '$cookieStore', 'JobsFactory', jobscontroller]);

    function jobscontroller($scope, $window, $cookieStore, JobsFactory) {
        var vm = this;
        $scope.jobs = [];
        $scope.supportsGeo = Modernizr.geolocation;
        $scope.isAjaxRequest = false;

        $scope.search = {
            jobtitle: $cookieStore.get('searches') ? $cookieStore.get('searches')[0].jobtitle : '',
            zipcode: $cookieStore.get('searches') ? $cookieStore.get('searches')[0].zipcode : ($cookieStore.get('zipcode') || '')
        };
        $scope.searches = $cookieStore.get('searches') || [];

        $scope.searchJobs = function () {
            if ($scope.jobsSearchFrm &&
                ($scope.jobsSearchFrm.jobtitle.$invalid || $scope.jobsSearchFrm.zipcode.$invalid)) {
                return;
            }

            // Add to searches.
            if (arrayObjectIndexOf($scope.searches, $scope.search.jobtitle, 'jobtitle') == -1 ||
                    arrayObjectIndexOf($scope.searches, $scope.search.zipcode, 'zipcode') == -1) {
                $scope.searches.push(angular.copy($scope.search, {}));  
            }
            
            // Store values in session cookies.
            $cookieStore.put('searches', $scope.searches);
            $cookieStore.put('zipcode', $scope.search.zipcode);
            
            $scope.jobs = [];
            $scope.isAjaxRequest = true;
            JobsFactory.getJobs({
                locationinput1: $scope.search.zipcode,
                textinput2: $scope.search.jobtitle
            }).$promise.then(function (response) {
                $scope.jobs = response.value.items;
                $scope.isAjaxRequest = false;
            
            });
        };

        $scope.setSearchCriteria = function (search) {
            angular.copy(search, $scope.search);
            $scope.searchJobs();
        };

        $scope.get_location = function () {
            if (Modernizr.geolocation) {
                navigator.geolocation.getCurrentPosition(function (e) {
                    // Use Google geocoding
                    var coords = e.coords;
                    var zipcode = '';
                    $.get('http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=' + coords.latitude + ',' + coords.longitude + '  ', function (data) {
                        var address = data.results[0].address_components;
                        for (var i = 0; i < address.length; i++) {
                            if (address[i].types[0] == 'postal_code') {
                                zipcode = address[i].short_name;
                                $scope.search.zipcode = zipcode;
                            
                                $scope.$apply();
                                $scope.searchJobs();
                                break;
                            }
                        }
                    });
                });
            } else {

            }
        };

        if (!$cookieStore.get('zipcode')) {
            $scope.get_location();
        }
    }
})(angular.module('app'));
