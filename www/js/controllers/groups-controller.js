angular.module('unearth.groupsController', [])
  .controller('GroupsController', function ($scope, $state, $ionicHistory, Authorization) {

    $scope.groups = [
      // ID: Name
      {id: 453, name:'group1'},
      {id: 453, name:'group2'},
      {id: 453, name:'group3'}
    ];

    $scope.pendingRequests = [
      // ID: Name
      {id: 453, name:'group1'},
      {id: 453, name:'group2'},
      {id: 453, name:'group3'}
    ];

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
      $scope.groups.push(group);
      $state.go('tab.groups');
    };

    $scope.switchGroup = function(group) {
      $state.go('tab.map');
    };

    $scope.acceptInvite = function(group) {
      alert('accepted into: ' + group.name);
    };

    $scope.declineInvite = function(group) {
      alert('declined invitation to: ' + group.name);
    };

    $scope.sendInvite = function(group) {
      alert('inviting a friend to: ' + group.name + '!');
    };

    $scope.leaveGroup = function(group) {
      if(confirm('You sure?  You can\'t rejoin an expedition without someone sending you an invite.')){
        for(var i = 0; i < $scope.groups.length; i++){
          if((group.name === $scope.groups[i].name) && (group.id === $scope.groups[i].id)){
            $scope.groups.splice(i, 1);
          }
        }
      }
    };
  });
