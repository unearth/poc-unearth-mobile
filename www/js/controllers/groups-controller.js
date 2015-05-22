angular.module('unearth.groupsController', [])
  .controller('GroupsController', function ($scope, $state, $ionicHistory, $rootScope, Group, Authorization, Modal) {

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
      // Sets the groupsData variable to the returned groups data to update the pending requests badge
      $scope.groupsData = groupsData.groups;

      // Saves the group data from the server to the Modal factory to be accessed by the modal
      Modal.saveGroupsData(groupsData);
      console.log("groupsData: ", groupsData);
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
            window.localStorage.setItem('currentExpedition', JSON.stringify(group.group_id));
          }
          $state.go('tab.groups');
        }
      });
    };

    $scope.switchGroup = function(group) {
      // Set maps to show
      window.localStorage.setItem('currentExpedition', JSON.stringify(group.group_id));
      $state.go('tab.map');
    };

    $scope.acceptInvite = function(group) {
      Group.groupJoin('accept', group.group_id, function(group) {
        if(error) {
          console.log('didn\'t work!');
        } else{
          alert('accepted invite into: ' + group.name);
          window.localStorage.setItem('currentExpedition', group.group_id);
        }
      });
    };

    $scope.declineInvite = function(group) {
      Group.groupJoin('decline', group.group_id, function() {
        if(error) {
          console.log('didn\'t work!');
        } else{
          alert('declined invite into: ' + group.name);
        }
      });
    };


    //DEBUG: Modals need to be made once and then cleared out after each use.
    $scope.inviteModal = function(group) {
      Modal.setInviteData({group: group.group_id});
      //Modal service needs group to be saved to Modaldata
      Modal.createInviteModal('../../templates/invite-modal.html');
    };

    // DEBUG: currently this just sends to server. Modal needs to populate data then call this once submitted.

    $scope.leaveGroup = function(group) {
      if(confirm('You sure?  You can\'t rejoin an expedition without someone sending you an invite.')){
        Group.groupJoin('leave', group.group_id, function() {
          if(error) {
            console.log('didn\'t work!');
          } else{
            if(window.localStorage.getItem('currentExpedition') === JSON.stringify(group.group_id)) {
              window.localStorage.setItem('currentExpedition', 'solo');
            }
            $state.go('tab.groups');
          }
        });
      }
    };

    $scope.showPendingRequests = function() {
      Modal.createPendingModal();
    }
  });






