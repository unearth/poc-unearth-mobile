angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, MarkersHTTP, Modal) {
    $scope.contact = {
      name: '',
      description: ''
    };

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

