/**
 * Created by dstefanovski on 7/22/2017.
 */

(function () {
    'use strict';

    angular.module('myApp').controller('oddsController', OddsController);

    function OddsController($rootScope, $scope, resolvedVal, APIService) {
        var vm = this;

        /*      Objects     */
        vm.odds = resolvedVal.data;
        vm.oddsObjects = [];            //all odds objects
        vm.allOddsTypeSorted = [];
        // vm.selectedLeague = {};
        vm.specificLeagueList = [];
        vm.specificLeagueListObjects = [];
        vm.hashOdds = {};

        /*      Functions       */
        vm.Type = Type;
        vm.Odd = Odd;
        vm.SpecificLeague = SpecificLeague;
        vm.SpecificLeagueOdd = SpecificLeagueOdd;
        vm.initOdds = initOdds;
        vm.findLeague = findLeague;
        vm.printOdds = printOdds;
        vm.goBack = goBack;

        /*      Odds Type objects       */
        function Type(id, priority, name, postition) {
            this.index = id;
            this.priority = priority;
            this.name = name;
            this.position = postition;
            this.odds = [];
        }

        Type.prototype.addOdd = function (odd) {
            this.odds.push(odd);
        };

        Type.prototype.sortOddsPriority = function () {
            this.odds.sort(function (a, b) {
                return a.priority - b.priority;
            });
        };

        /*      Odds objects       */
        function Odd(id, priority, name) {
            this.id = id;
            this.priority = priority;
            this.name = name;
        }
        
        /*      Specific League objects*/
        function SpecificLeague(id, startDate, homeTeam, awayTeam, odds) {
            this.id = id;
            this.sd = moment(startDate).format('MM-DD HH:mm');
            this.h = homeTeam;
            this.a = awayTeam;
            this.odds = odds;
            this.oddsPrint = [];
        }

        SpecificLeague.prototype.sortOddsType = function () {
            var tempArrayOdds = [];
            angular.forEach(this.odds, function (value, key) {
                // console.log(value);
                // console.log(vm.hashOdds[key]);
                var objBeforeSort = {
                    position : vm.hashOdds[key],
                    type : key,
                    odds : value
                };
                tempArrayOdds.push(objBeforeSort);
            });
            this.oddsPrint = tempArrayOdds.slice();

            if(vm.oddsObjects.length > this.oddsPrint.length){
                for(var i = 0; i < vm.oddsObjects.length; i++) {
                    var tempFlag = true;
                    for(var j = 0; j < this.oddsPrint.length; j++) {
                        if(vm.oddsObjects[i].position == this.oddsPrint[j].position){
                            tempFlag = false;
                            break;
                        }
                    }
                    if(tempFlag){
                        var objBeforeSort = {
                            position : i+1,
                            type : "-",
                            odds : "-"
                        };
                        this.oddsPrint.push(objBeforeSort);
                    }
                }
            }
            this.oddsPrint.sort(function(a,b) {
                return a.position - b.position;
            });
            // console.log(this.oddsPrint);
        };

        /*      Specific League objects*/
        function SpecificLeagueOdd(name, value, id) {
            this.name = name;
            this.value = value;
            this.id = id;
        }

        /*      Creating the objects        */
        function initOdds() {
            /*      Odds type details       */
            angular.forEach(vm.odds, function (value, key) {
                var tempOddType = new Type(value.index, value.priority, value.name);

                /*      Odds details       */
                angular.forEach(value.odds, function (value, key) {
                    var tempOdd = new Odd(value.id, value.priority, value.name);
                    tempOddType.addOdd(tempOdd);
                });
                tempOddType.sortOddsPriority();
                vm.oddsObjects.push(tempOddType);
            });

            vm.oddsObjects.sort(function (a, b) {
                return a.priority - b.priority;
            });

            angular.forEach(vm.oddsObjects, function (value, key) {
                vm.oddsObjects[key].position = key+1;
                vm.hashOdds[value.index] = key+1;
            });
        }

        function printOdds(specificLeagueList) {
            vm.specificLeagueListObjects = [];
            angular.forEach(vm.specificLeagueList.data, function (value, key) {
                var tempSL = new SpecificLeague(value.id, value.sd, value.h, value.a, value.odds);
                tempSL.sortOddsType();
                vm.specificLeagueListObjects.push(tempSL);
            });
        }

        function findLeague() {
            APIService.getSpecificLeague($rootScope.selectedLeague.id).then(function (success) {
                vm.specificLeagueList = success;
                printOdds(vm.specificLeagueList);
            }, function (error) {
                console.log("error");
            });
            console.log("dime");
        }
        
        function goBack() {
            window.location = '/app/#!/tree';
        }

        /*      Catching the broadcast      */
        // $scope.$on("eventLeague", function (evt, data) {
        //     vm.selectedLeague = data;
        //     console.log(vm.selectedLeague);
        //     findLeague(vm.selectedLeague);
        // });

        initOdds();
        findLeague();
    }
})();