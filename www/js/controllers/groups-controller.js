angular.module('unearth.groupsController', [])
  .controller('GroupsController', function ($scope, $state, $ionicHistory, $rootScope, Group, Authorization) {

    if(window.localStorage.groups === undefined){
      window.localStorage.groups = JSON.stringify( [{id: 1, name: 'Group'}] );
    } else {
      // TODO: Check local groups against server groups
        // New user-created groups have an id of null
        // Deleted groups will be on server, but not locally
    }
    if(window.localStorage.pendingGroups === undefined){
      window.localStorage.pendingGroups = JSON.stringify( [{id: 1, name: 'Group'}]);
      // TODO: Check local groups against server groups
        // Deleted groups will be on server, but not locally
    }

    // Broadcasts change in local storage.
    $rootScope.$broadcast('storage');

    $scope.groups = JSON.parse(window.localStorage.groups);
    $scope.pendingGroups = JSON.parse(window.localStorage.groups);
      // ID: Name
      // [
      // {id: 453, name:'group1'},
      // {id: 453, name:'group2'},
      // {id: 453, name:'group3'}
      // ]

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.newGroup = {
      id: '',
      name: ''
    };

    $scope.listCanSwipe = true;

    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.createGroup = function(group) {
      group.groupCreate(group.name, group.id, function(error, response) {
        if(error){
          console.log('didn\'t work!');
        } else{

          window.localStorage.groups.push(group);
          // Broadcasts change in local storage.
          $rootScope.$broadcast('storage');

          $state.go('tab.groups');
        }
      });
    };

    $scope.switchGroup = function(group) {
      // Set maps to show
      $state.go('tab.map');
    };

    $scope.acceptInvite = function(group) {
      group.groupJoin('accept', group.id, function(group) {
        if(error) {
          console.log('didn\'t work!');
        } else{
          window.localStorage.groups.push(group);
          $rootScope.$broadcast('storage');
          alert('accepted invite into: ' + group.name);
        }
      });
    };

    $scope.declineInvite = function(group) {
      group.groupJoin('decline', group.id, function() {
        if(error) {
          console.log('didn\'t work!');
        } else{
          alert('declined invite into: ' + group.name);
        }
      });
    };

    $scope.sendInvite = function(group) {
      group.groupInvite(email, group.id, function() {
        if(error) {
          console.log('did\'t work!');
        } else{
          alert('inviting a friend to: ' + group.name + '!');
        }
      });
    };

    $scope.leaveGroup = function(group) {
      if(confirm('You sure?  You can\'t rejoin an expedition without someone sending you an invite.')){
        group.groupJoin('leave', group.id, function() {
          if(error) {
            console.log('didn\'t work!');
          } else{
            var groups = window.localStorage.groups;
            for(var i = 0; i < groups.length; i++){
              if((group.name === groups[i].name) && (group.id === groups[i].id)){
                groups.splice(i, 1);
              }
            }
          }
        });
      }
    };
  });
