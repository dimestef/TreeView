/**
 * Created by dstefanovski on 7/20/2017.
 */

(function () {
    'use strict';

    angular.module('myApp').controller('betController', BetController);

    function BetController($rootScope, $scope, resolvedVal) {
        var vm = this;

        /*      Objects     */
        vm.sports = resolvedVal.data;
        vm.dataTreeSportObjects = [];

        /*      Functions       */
        vm.DataTree = DataTree;
        vm.Country = Country;
        vm.League = League;
        vm.initSports = initSports;
        vm.broadcastLeague = broadcastLeague;

        /*      Data Tree objects       */
        function DataTree(id, priority, name, total) {
            this.id = id;
            this.priority = priority;
            this.name = name;
            this.total = total;
            this.countries = [];
        }

        DataTree.prototype.addCountry = function (country) {
            this.countries.push(country);
        };

        DataTree.prototype.sortCountriesAlphabetically = function () {
            this.countries.sort(function(a,b) {
                if(a.name < b.name){
                    return -1;
                }
                if(a.name > b.name){
                    return 1;
                }
                return 0;
            });
        };

        /*      Country objects       */
        function Country(id, name, total) {
            this.id = id;
            this.name = name;
            this.total = total;
            this.leagues = [];
        }

        Country.prototype.addLeague = function (league) {
            this.leagues.push(league);
        };

        Country.prototype.sortLeaguesAlphabetically = function () {
            this.leagues.sort(function(a,b) {
                if(a.name < b.name){
                    return -1;
                }
                if(a.name > b.name){
                    return 1;
                }
                return 0;
            });
        };

        /*      League objects       */
        function League(id, name, total) {
            this.id = id;
            this.name = name;
            this.total = total;
        }

        /*      Creating the objects        */
        function initSports() {
            /*      Sports details      */
            angular.forEach(vm.sports, function(value, key) {
                var tempDataTree = new DataTree(value.id, value.priority, value.name, value.total);

                /*      Countries details       */
                angular.forEach(value.countries, function(value, key) {
                    var tempCountry = new Country(value.id, value.name, value.total);

                    /*      Leagues details       */
                    angular.forEach(value.leagues, function(value, key) {
                        var tempLeague = new League(value.id, value.name, value.total);
                        tempCountry.addLeague(tempLeague);
                    });

                    /*      Leagues sorting alphabetically      */
                    tempCountry.sortLeaguesAlphabetically();
                    tempDataTree.addCountry(tempCountry);
                });

                /*      Countries sorting alphabetically      */
                tempDataTree.sortCountriesAlphabetically();
                vm.dataTreeSportObjects.push(tempDataTree);
            });

            /*      DataTreeSportObjects sorting Descending       */
            vm.dataTreeSportObjects.sort(function(a,b) {
                return b.priority - a.priority;
            });
        }

        /*      Broadcast event     */
        function broadcastLeague(league) {
            window.location = '/app/#!/odds';
            // $rootScope.$broadcast('eventLeague', league);
            $rootScope.selectedLeague = league;
        }
        
        initSports();
    }
})();