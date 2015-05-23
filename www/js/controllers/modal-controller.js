angular.module('unearth.modalController', [])
  .controller('ModalController', function($scope, RenderMap, MarkersHTTP, Modal) {
    $scope.contact = {
      name: '',
      description: ''
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
      link: function ($scope, $el, attrs, ngModel) {
        ngModel.$render = function () {
          ngModel.$setViewValue($el.val());
        };
      $el.bind('change', function () {
        $scope.$apply(function () {
          $scope.imageuploaded = $('.image')[0].files[0].name;
          ngModel.$render();
        });
      });
    }
  };

});

