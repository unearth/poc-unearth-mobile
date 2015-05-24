angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, MarkersHTTP, Modal, Group) {
    $scope.contact = {
      name: '',
      description: ''
    };

    $scope.groupsData = Modal.groupsData();

    $scope.closePending = function() {
      Modal.closePending();
    };

    $scope.clearError = function(markerForm) {
      markerForm.$submitted = false;
    };

    $scope.submitMarker = function() {
      var fd = new FormData();
      fd.append('file', $('.image')[0].files[0], 'image');

      var createMarker = function(imageData){
        RenderMap.createMarker($scope.contact.title, $scope.contact.description, imageData);
        $scope.contact.title = '';
        $scope.contact.description = '';
      };

      if ($('.image')[0].files[0]) {
        MarkersHTTP.postMarkerImage(fd, function(response) {
          createMarker(response.data.image_url);
        });
      } else {
        createMarker('');
      }
    };

    // $scope.closeModal = function() {
    //   RenderMap.createMarker($scope.contact.name, $scope.contact.description);
    //   $scope.contact.name = '';
    //   $scope.contact.description = '';
    // };

    $scope.sendInvite = function(email) {
      Modal.setInviteData({email: email});
      Modal.closeInviteModal();
    };

    Group.getInvites(function(pendingGroups) {
      if(pendingGroups.groups.length > 0){
        $scope.numInvites = pendingGroups.groups[0].outstandingInvites.length;
        $scope.pendingGroups = [];
        for (var i = 0; i < $scope.numInvites; i++) {
          $scope.pendingGroups.push(pendingGroups.groups[0].outstandingInvites[i][1][0]);
          $scope.pendingGroups[$scope.pendingGroups.length - 1].group_id = pendingGroups.groups[0].outstandingInvites[i][0].group_id;
        }
      }
    });

    $scope.acceptInvite = function(group) {

      Group.groupJoin('accept', group.group_id, function(response) {
        if(response) {
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
        if(!response) {
          console.log('didn\'t work!');
        }
      });

      Modal.closePending();
    };
  })

  .directive('validFile', function () {
    return {
      require: 'ngModel',
      link: function (scope, el, attrs, ngModel) {
        ngModel.$render = function () {
          ngModel.$setViewValue(el.val());
        };
      el.bind('change', function () {
        scope.$apply(function () {
          ngModel.$render();
          });
        });
      }
    };
  });
