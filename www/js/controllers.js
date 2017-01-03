angular.module('afloat.controllers', [])

.controller('DashCtrl', function($scope, $cordovaLocalNotification, $ionicPopup, $ionicPlatform, $cookies, AllServices, $ionicModal) {

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

    AllServices.getMoods(cookie.id).success(function(moods) {
      $scope.moods = moods
      getDate($scope.moods)
    })

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

    $ionicModal.fromTemplateUrl('templates/genPop/moods.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal1 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/genPop/positive.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal2 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/genPop/suggestion.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal3 = modal;
    });

    $scope.openModal = function() {
      $scope.modal1.show();
    };

    $scope.closeModal = function() {
      $scope.modal1.hide();
      $scope.modal2.hide()
      $scope.modal3.hide()
      $scope.modal4.hide()
    };

    $scope.submitMood = function(mood) {
      var moodObj = {
        users_id: cookie.id,
        mood: mood
      }

      if (mood == 'positive') {
        moodObj.rating = 1
      } else if (mood == 'neutral') {
        moodObj.rating = 0
      } else {
        moodObj.rating = -1
      }

      AllServices.postMood(moodObj).success(function(data) {
        AllServices.getActivities(cookie.id).success(function(data) {
          $scope.activities = data
        })
        $scope.modal1.remove()
        if (mood === 'positive') {
          $scope.modal2.show()
        } else {
          $scope.modal3.show()
        }
      })
    }

    $ionicModal.fromTemplateUrl('templates/inputActivity/inputForm.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal4 = modal;
    });

    $scope.openActivityModal = function() {
      $scope.modal4.show()
    }

    $scope.submitNewActivity = function(input) {
      var activityObj = {
        users_id: cookie.id,
        activity: input.activity,
        weight: 1
      }
      AllServices.postActivity(activityObj).success(function(data) {
        console.log('data:', data);
        $scope.modal4.hide()
      })
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

.controller('NightController', function($scope, $ionicPlatform, AllServices, $cookies) {

  $ionicPlatform.ready(function() {

    var cookie = $cookies.getObject('mobileLogIn')
    console.log('cookie.id:', cookie.id);
    $scope.user = cookie

    AllServices.getMoods(cookie.id).success(function(moods) {
      var negativeMoods = []
      for (i = 0; i < moods.length; i++) {
        if (moods[i].rating < 0) {
          negativeMoods.push(moods[i])
        }
      }
      if (negativeMoods.length > 0) {
        $scope.moods = negativeMoods
      } else {
        $scope.positive = 'Great job today!'
      }
    })

    AllServices.getActivities(cookie.id).success(function(data) {
      $scope.activities = []
      for (i = 0; i < data.length; i++) {
        var newActivity = {
          id: data[i].id,
          activity: data[i].activity,
          weight: data[i].weight,
          checked: false
        }
        $scope.activities.push(newActivity)
      }
    })

    $scope.save = function(arr) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i].checked == true) {
          var obj = {
            id: arr[i].id,
            users_id: cookie.id,
            activity: arr[i].activity,
            weight: arr[i].weight + 1
          }
          AllServices.updateWeight(obj).success(function(data){
            console.log('data:', data);
          })
        }
      }
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
