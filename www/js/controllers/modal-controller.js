
angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, Modal) {
    $scope.contact = {
      title: '',
      description: ''
    };

    $scope.groupsData = Modal.groupsData();
    console.log("$scope.groupsData: ", $scope.groupsData);

    $scope.pendingGroups = $scope.groupsData.groups;

    $scope.closeModal = function() {
      RenderMap.createMarker($scope.contact.title, $scope.contact.description);
      $scope.contact.title = '';
      $scope.contact.description = '';
    }
  });
