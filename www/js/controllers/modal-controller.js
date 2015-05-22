angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, Modal) {
    $scope.contact = {
      title: '',
      description: ''
    };

    $scope.closeModal = function() {
      RenderMap.createMarker($scope.contact.title, $scope.contact.description);
      $scope.contact.title = '';
      $scope.contact.description = '';
    };

    $scope.sendInvite = function(email) {
      Modal.setInviteData({email: email});
      Modal.closeInviteModal();
    };
  });
