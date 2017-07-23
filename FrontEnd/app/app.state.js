/**
 * Created by dstefanovski on 7/22/2017.
 */


app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/tree');

    $stateProvider
        .state('tree', {
            url: '/tree',
            templateUrl: './templates/tree.html',
            controller: 'betController',
            controllerAs: 'vm',
            resolve: {
                resolvedVal: ['APIService', function(APIService) {
                    return APIService.getDataLayout().then(function (success) {
                        return success;
                    }, function (error) {
                        // Implement error handling
                    });
                }]
            }
        })

        .state('odds', {
            url: '/odds',
            templateUrl: './templates/oddsLayout.html',
            controller: 'oddsController',
            controllerAs: 'vm',
            resolve: {
                resolvedVal: ['APIService', function(APIService) {
                    return APIService.getOddsLayout().then(function (success) {
                        return success;
                    }, function (error) {
                        // Implement error handling
                    });
                }]
            }
        })
});