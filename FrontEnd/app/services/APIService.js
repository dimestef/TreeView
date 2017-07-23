/**
 * Created by dstefanovski on 7/21/2017.
 */

(function () {
    'use strict';

    angular.module('myApp').
    factory('APIService', APIService);

    function APIService($http, $q) {
        return {
            getDataLayout: function () {
                return $http.get('http://localhost:3000/dataTree');
            },

            getOddsLayout: function () {
                return $http.get('http://localhost:3000/dataLayout');
            },

            getSpecificLeague: function (league) {
                return $http.get('http://localhost:3000/league_' + league);
            }
        };
    }
})();
