angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap) {
    $scope.contact = {
      title: '',
      description: ''
    };

    $scope.closeModal = function() {
      RenderMap.createMarker($scope.contact.title, $scope.contact.description);
      $scope.contact.title = '';
      $scope.contact.description = '';
    }
  });
