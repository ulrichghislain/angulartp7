'use strict';

/**
 * @ngdoc function
 * @name angulartp7App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartp7App
 */
var editingMode = false;
var id_ = -1; //ID de personne à supprimer
var emptyObject = {};
var opowerApp = angular.module('opowerApp');

opowerApp.controller('MainCtrl', function ($scope, $log, opowerAppFactory) {
    $scope.persons = [];
    $scope.Tabs = [
        {id : 0, heading: 'Person', active : true, templateUrl:'/views/person.html'},
        {id : 1, heading: 'Home', active : false, templateUrl:'/views/home.html'},
        {id : 2, heading: 'Machine', active : false, templateUrl:'/views/machine.html'}
      ];
    $scope.person = angular.copy(emptyObject);
    //GET
    opowerAppFactory.query(function(data){
        if(data.persons !== undefined)
        {
            if(data.persons.length > 1){
                $scope.persons=data.persons;
            }
            else{
                $scope.persons.push(data.persons);
            }
        }
    }, function(data){
        $scope.serverResponse = data.status+' '+data.statusText;
    });

    $scope.submit = function()
    {
        if($scope.isValid($scope.person))
        {
                $scope.loading = true;
                //POST
                if(!editingMode){
                    opowerAppFactory.save($scope.person, function(data){
                            $scope.persons.push(data);
                            $scope.person = angular.copy(emptyObject);
                            $scope.loading = false;
                       }, function(response){
                            $scope.serverResponse = response.status+' '+response.statusText;
                            $scope.loading = false;
                       });
                }
                //PUT
                if(editingMode){
                        opowerAppFactory.update({personId:$scope.person.id}, $scope.person, function(data){
                                id_ = data.id;
                                var index = $scope.persons.findIndex($scope.getPersonIndex);
                                //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/fill
                                $scope.persons.fill(data, index, index+1);
                                $scope.person = angular.copy(emptyObject);
                                $scope.loading = false;
                        }, function(response){
                                $scope.serverResponse = response.status+' '+response.statusText;
                                $scope.loading = false;
                        });
                }
                editingMode = false;
        }
    };

    $scope.edit = function(person){
        $scope.person = angular.copy(person);
        editingMode = true;
    };
    //DELETE
    $scope.remove = function(person){
              $scope.loading = true;
              opowerAppFactory.remove({personId:person.id}, function(data){
              id_ = data.id;
              //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/findIndex
              var index = $scope.persons.findIndex($scope.getPersonIndex);
              $scope.persons.splice(index, 1);
              $scope.loading = false;
        }, function(response){
              $scope.serverResponse = response.status+' '+response.statusText;
              $scope.loading = false;
        });
    };

    $scope.getPersonIndex = function(element, index, array){
        if(element.id === id_)
            return true;
        return false;
    };

    $scope.isValid = function(person){
        return (person.firstname !== undefined && person.surname !== undefined && person.mail !== undefined);
    };
  })
;
