'use strict';
var opowerApiUrl = '/rest/person/:personId';
var opowerAppService = angular.module('opowerAppService', ['ngResource']);

opowerAppService.factory('opowerAppFactory', function ($resource) {
    return $resource(opowerApiUrl, {personId: '@id'},
            {save:
                        {method: 'POST',
                            headers: {'Content-Type': 'application/json;charset=utf-8'}
                        },
             query: {method: 'GET', isArray: false},
             update: {method: 'PUT'},
             remove: {method: 'DELETE',
                            headers: {'Content-Type': 'application/json;charset=utf-8'}
                     }
            });
});