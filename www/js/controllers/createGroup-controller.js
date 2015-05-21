angular.module('unearth.createGroupController', [])
  .controller('CreateGroupController', function($scope, $state, Group) {
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
            // var expeditions = JSON.parse(window.localStorage.getItem('expeditions'));
            // expeditions.push(group);
            // window.localStorage.setItem('expeditions', JSON.stringify(expeditions));
            // DEBUG: Need to receive group id from response.
            console.log(response);
            window.localStorage.setItem('currentExpedition', JSON.stringify(response['groupId']["?column?"]));
         }
       }

       $state.go('tab.groups');
      });
    };
  });
