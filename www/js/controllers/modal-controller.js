
angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, Modal, Group) {
    $scope.contact = {
      title: '',
      description: ''
    };

    $scope.groupsData = Modal.groupsData();
    // console.log("$scope.groupsData: ", $scope.groupsData);


    Group.getInvites(function(pendingGroups) {
      console.log(pendingGroups);
      $scope.numInvites = pendingGroups.groups[0].outstandingInvites.length;
      $scope.pendingGroups = [];
      for (var i = 0; i < $scope.numInvites; i++) {
        $scope.pendingGroups.push(pendingGroups.groups[0].outstandingInvites[i][1][0]);
      }
    });

    $scope.acceptInvite = function(group) {
      Group.groupJoin('accept', group.group_id, function(group) {
        if(group) {
          alert('accepted invite into: ' + group.name);
          window.localStorage.setItem('currentExpedition', group.group_id);
        } else{
          console.log('didn\'t work!');
        }
      });

      Modal.closePending();
    };

    $scope.declineInvite = function(group) {
      Group.groupJoin('deny', group.group_id, function(response) {
        if(response) {
          alert('declined invite into: ' + group.name);
          console.log(response);
        } else{
          console.log('didn\'t work!');
        }
      });

      Modal.closePending();
    };

    $scope.closeModal = function() {
      RenderMap.createMarker($scope.contact.title, $scope.contact.description);
      $scope.contact.title = '';
      $scope.contact.description = '';
    }
  });
