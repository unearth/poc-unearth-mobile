angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, MarkersHTTP, Modal, Group) {
    $scope.contact = {
      name: '',
      description: ''
    };
    $scope.groupsData = Modal.groupsData();

    $scope.submit = function() {
      var fd = new FormData();
      fd.append('file', $('.image')[0].files[0], 'image');
      MarkersHTTP.postMarkerImage(fd, function(response) {
        RenderMap.createMarker($scope.contact.name, $scope.contact.description, response.data.image_url);
        $scope.contact.name = '';
        $scope.contact.description = '';
      });
    };
    $scope.closeModal = function() {
      RenderMap.createMarker($scope.contact.name, $scope.contact.description);
      $scope.contact.name = '';
      $scope.contact.description = '';
    };

    $scope.sendInvite = function(email) {
      Modal.setInviteData({email: email});
      Modal.closeInviteModal();
    };

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
