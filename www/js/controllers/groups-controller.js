angular.module('unearth.groupsController', [])
  .controller('GroupsController', function ($scope, $state, $ionicHistory, $rootScope, Group, Authorization) {

    // if(window.localStorage.groups === undefined){
    //   window.localStorage.groups = JSON.stringify( [{id: 1, name: 'Group'}] );
    // } else {
    //   // TODO: Check local groups against server groups
    //     // New user-created groups have an id of null
    //     // Deleted groups will be on server, but not locally
    // }
    // if(window.localStorage.pendingGroups === undefined){
    //   window.localStorage.pendingGroups = JSON.stringify( [{id: 1, name: 'Group'}]);
    //   // TODO: Check local groups against server groups
    //     // Deleted groups will be on server, but not locally
    // }

    // // Broadcasts change in local storage.
    // $rootScope.$broadcast('storage');

    // $scope.groups = JSON.parse(window.localStorage.groups);
    // $scope.pendingGroups = JSON.parse(window.localStorage.groups);
      // ID: Name
      // [
      // {id: 453, name:'group1'},
      // {id: 453, name:'group2'},
      // {id: 453, name:'group3'}
      // ]

    Group.getGroups(function(groupsData) {
      //$scope.groupsData = groupsData;
    });

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.newGroup = {
      description: '',
      name: ''
    };

    $scope.listCanSwipe = true;

    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.createGroup = function(group) {
      // DEBUG: Not sure that the http callback will return error, response -> look in httpServices
      Group.groupCreate(group.name, group.description, function(response, error) {
        if(error){
          console.log('didn\'t work!');
        } else{
          // DEBUG: Expeditions do not populate when we click on expeditions tab.
          if (!window.localStorage.getItem('expeditions')) {
            window.localStorage.setItem('expeditions', JSON.stringify([group]));
          } else {
            var expeditions = JSON.parse(window.localStorage.getItem('expeditions'));
            expeditions.push(group);

            window.localStorage.setItem('expeditions', JSON.stringify(expeditions));

            // DEBUG: Need to receive group id from response.
            window.localStorage.setItem('currentExpedition', JSON.stringify(group.id));
          }
          $state.go('tab.groups');
        }
      });
    };

    $scope.switchGroup = function(group) {
      // Set maps to show
      window.localStorage.setItem('currentExpedition', JSON.stringify(group.id));
      $state.go('tab.map');
    };

    $scope.acceptInvite = function(group) {
      Group.groupJoin('accept', group.id, function(group) {
        if(error) {
          console.log('didn\'t work!');
        } else{
          alert('accepted invite into: ' + group.name);
          window.localStorage.setItem('currentExpedition', group.id);
        }
      });
    };

    $scope.declineInvite = function(group) {
      Group.groupJoin('decline', group.id, function() {
        if(error) {
          console.log('didn\'t work!');
        } else{
          alert('declined invite into: ' + group.name);
        }
      });
    };

    $scope.sendInvite = function(group) {
      Group.groupInvite(email, group.id, function() {
        if(error) {
          console.log('did\'t work!');
        } else{
          alert('inviting a friend to: ' + group.name + '!');
        }
      });
    };

    $scope.leaveGroup = function(group) {
      if(confirm('You sure?  You can\'t rejoin an expedition without someone sending you an invite.')){
        Group.groupJoin('leave', group.id, function() {
          if(error) {
            console.log('didn\'t work!');
          } else{
            if(window.localStorage.getItem('currentExpedition') === JSON.stringify(group.id)) {
              window.localStorage.setItem('currentExpedition', 'solo');
            }
            $state.go('tab.groups');
          }
        });
      }
    };
  });
