angular.module('unearth.groupsController', [])
  .controller('ModalController', function($scope, RenderMap, MarkersHTTP) {

    $scope.contact = {
      title: '',
      description: ''
    };

    $scope.submit = function() {
      var fd = new FormData();
      fd.append('file', $('.image')[0].files[0], 'image');
      MarkersHTTP.postMarkerImage(fd, function(response) {
        console.log(response)
        RenderMap.createMarker($scope.contact.title, $scope.contact.description, response.data.image_url);
        $scope.contact.title = '';
        $scope.contact.description = '';
      });
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
