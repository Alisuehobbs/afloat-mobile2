angular.module('afloat.controllers', [])

.controller('DashCtrl', function($scope, $cordovaLocalNotification, $ionicPopup, $ionicPlatform, $cookies, AllServices) {

  $ionicPlatform.ready(function() {

    var cookie = $cookies.getObject('mobileLogIn')
    console.log('cookie.id:', cookie.id);
    $scope.user = cookie

    console.log('im super ready');

    $scope.add = function() {
      console.log('I was clicked');
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'I will be so excited',
        text: 'If I see this on the phone',
        data: {
          customProperty: 'custom value'
        },
        at: new Date(new Date().getTime() + 10 * 1000)
      }).then(function(result) {
        console.log('result:', result);
        $ionicPopup.alert({
          title: 'blach',
          content: 'boodeah'
        })
      });
    };

    // AllServices.getMoods(cookie.id).success(function(moods) {
    //   $scope.moods = moods.data
    //   getDate($scope.moods)
    // })

    function getDate(moodsArray) {
      let todayDate = moment()
      let today = []
      let week = []
      let year = []
      for (var i = 0; i < moodsArray.length; i++) {
        if (moment(moodsArray[i].updated_at).isSame(todayDate, 'day')) {
          today.push(moodsArray[i].rating)
        } else if (moment(moodsArray[i].updated_at).isSame(todayDate, 'week')) {
          week.push(moodsArray[i].rating)
        } else if (moment(moodsArray[i].updated_at).isSame(todayDate, 'year')) {
          year.push(moodsArray[i].rating)
        }
      }
      setScope(today, week, year)
    }

    function setScope(today, week, year) {
      $scope.day = {
        type: 'line',
        series: [{
          values: today
        }]
      }

      $scope.week = {
        type: 'line',
        series: [{
          values: week
        }]
      }

      $scope.year = {
        type: 'line',
        series: [{
          values: year
        }]
      }
    }

    $scope.setChartScope = function(input) {
      if (input == "day") {
        $scope.myJson = $scope.day
      } else if (input == "week") {
        $scope.myJson = $scope.week
      } else {
        $scope.myJson = $scope.year
      }
    }

  })
})

.controller('RegisterCtrl', function($scope, $ionicPlatform, AllServices, $location, $cookies) {
  $ionicPlatform.ready(function() {

    $scope.submitSignUp = function(newUser) {
      AllServices.postNewUser(newUser).success(function(response) {
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
      AllServices.loginUser(returningUser).success(function(response) {
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
