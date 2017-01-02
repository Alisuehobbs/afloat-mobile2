angular.module('afloat.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('RegisterCtrl', function($scope, $ionicPlatform, UserService, $location, $cookies) {
  $ionicPlatform.ready(function() {

    $scope.submitSignUp = function(newUser) {
      UserService.postNewUser(newUser).success(function(response) {
        if (!response.message) {
          $cookies.putObject('mobileLogIn', response[0])
          $scope.newUser = {}
          $location.url('/tab/dash')
        } else {
          $scope.error = response.message
        }
      })
    }

    $scope.submitLogIn = function(returningUser) {
      UserService.loginUser(returningUser).success(function(response) {
        if (!response.message) {
          $cookies.putObject('mobileLogIn', response)
          $scope.returningUser = {}
          $location.url('/tab/dash')
        } else {
          $scope.error = response.message
        }
      })
    }
  })
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
