angular.module('afloat.controllers', [])

.controller('DashCtrl', function($scope, $cordovaLocalNotification, $ionicPopup, $ionicPlatform, $cookies, AllServices, $ionicModal, $location, $rootScope) {

  $ionicPlatform.ready(function() {

    var cookie = $cookies.getObject('mobileLogIn')
    if (!cookie) {
      $location.url('/landing')
    } else {
      $scope.user = cookie

      $rootScope.$on('$cordovaLocalNotification:click',
        function(event, notification, state) {
          if (notification.id == 1 || notification.id == 2) {
            console.log('notification ', notification.id, ' was clicked');
            $scope.modal1.show()
          } else {
            console.log('notification ', notification.id, ' was clicked');
            $location.url('/nightlyCheckIn')
          }
        });

      AllServices.getMoods(cookie.id).success(function(moods) {
        $scope.moods = moods
        getDate($scope.moods)
      })

      var today = []
      var thisWeek = []
      var thisYear = []

      function getDate(moodsArray) {
        var todayDate = moment()
        for (var i = 0; i < moodsArray.length; i++) {
          if (moment(moodsArray[i].created_at).isSame(todayDate, 'day')) {
            today.push(moodsArray[i].rating)
          }
          if (moment(moodsArray[i].created_at).isSame(todayDate, 'week')) {
            thisWeek.push(moodsArray[i].rating)
          }
          if (moment(moodsArray[i].created_at).isSameOrBefore(todayDate, 'year')) {
            thisYear.push(moodsArray[i].rating)
          }
        }
        setScope(today, thisWeek, thisYear)
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

      $ionicModal.fromTemplateUrl('templates/moods.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal1 = modal;
      });

      $ionicModal.fromTemplateUrl('templates/positive.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal2 = modal;
      });

      $ionicModal.fromTemplateUrl('templates/suggestion.html', {
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
          $scope.modal1.hide()
          if (mood === 'positive') {
            today.push(1)
            thisWeek.push(1)
            thisYear.push(1)
            $scope.modal2.show()
          } else if (mood === 'neutral') {
            today.push(0)
            thisWeek.push(0)
            thisYear.push(0)
            $scope.modal2.show()
          } else {
            today.push(-1)
            thisWeek.push(-1)
            thisYear.push(-1)
            $scope.modal3.show()
          }
        })
      }

      $ionicModal.fromTemplateUrl('templates/inputForm.html', {
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
          $scope.modal4.hide()
        })
      }
    }

  })
})

.controller('RegisterCtrl', function($scope, $ionicPlatform, AllServices, $location, $cookies, $cordovaLocalNotification) {
  $ionicPlatform.ready(function() {

    var cookie = $cookies.getObject('mobileLogIn')
    if (cookie) {
      $location.url('/tab/dash')
    } else {
      $scope.submitSignUp = function(newUser) {
        AllServices.postNewUser(newUser).success(function(response) {
          if (!response.message) {
            console.log('response:', response);
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
            console.log('response:', response);
            $cookies.putObject('mobileLogIn', response)
            $scope.returningUser = {}
            $location.url('/tab/dash')
          } else {
            $scope.error = response.message
          }
        })
      }

      $scope.add = function() {
        console.log('notification 1 was clicked');
        var morningTime = new Date();
        morningTime.setHours(16);
        morningTime.setMinutes(25);
        morningTime.setSeconds(0);
        console.log('morningTime:', morningTime);
        $cordovaLocalNotification.schedule({
          id: 1,
          title: 'Good Morning!',
          text: 'How are you feeling?',
          every: 'day'
        }).then(function(result) {
          console.log('result1:', result);
        })

        console.log('notification 2 was clicked');
        var afternoonTime = new Date();
        afternoonTime.setHours(16);
        afternoonTime.setMinutes(26);
        afternoonTime.setSeconds(0);
        console.log('afternoonTime:', afternoonTime);
        $cordovaLocalNotification.schedule({
          id: 2,
          title: 'Good Afternoon!',
          text: 'How are you feeling?',
          every: 'day'
        }).then(function(result) {
          console.log('result2:', result);
        })

        console.log('notification 3 was clicked');
        var eveningTime = new Date();
        eveningTime.setHours(16);
        eveningTime.setMinutes(27);
        eveningTime.setSeconds(0);
        console.log('eveningTime:', eveningTime);
        $cordovaLocalNotification.schedule({
          id: 3,
          title: 'Good Evening!',
          text: "It's time to check in.",
          every: 'day'
        }).then(function(result) {
          console.log('result3:', result);
        })
      };
    }
  })
})

.controller('NightController', function($scope, $ionicPlatform, AllServices, $cookies, $location, $ionicModal) {

  $ionicPlatform.ready(function() {

    var cookie = $cookies.getObject('mobileLogIn')
    $scope.user = cookie

    var todayDate = moment()

    $scope.log = todayDate

    AllServices.getMoods(cookie.id).success(function(moods) {
      var negativeMoods = []
      for (i = 0; i < moods.length; i++) {
        if (moods[i].rating < 0 && moment(moods[i].created_at).isSame(todayDate, 'day')) {
          negativeMoods.push(moods[i])
        }
      }
      if (negativeMoods.length > 0) {
        $scope.moods = negativeMoods
      } else {
        $scope.modal2.show()
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
          AllServices.updateWeight(obj).success(function(data) {
            $location.url('/tab/dash')
          })
        }
      }
    }

    $ionicModal.fromTemplateUrl('templates/inputForm.html', {
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
        $scope.modal4.hide()
        $location.url('/tab/dash')
      })
    }

    $ionicModal.fromTemplateUrl('templates/positive.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal2 = modal;
    });

    $scope.closeModal = function() {
      $scope.modal2.hide()
      $location.url('/tab/dash')
    };

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
