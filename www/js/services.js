angular.module('afloat.services', [])

.factory('AllServices', function($http) {
  var service = {}

  service.postNewUser = function(data) {
    return $http.post('https://alisuehobbs-afloat.herokuapp.com/signup', data)
  }

  service.loginUser = function(data) {
    return $http.post('https://alisuehobbs-afloat.herokuapp.com/login', data)
  }

  service.getMoods = function(id) {
    return $http.get(`https://alisuehobbs-afloat.herokuapp.com/moods/${id}`)
  }

  service.postMood = function(data) {
    return $http.post('https://alisuehobbs-afloat.herokuapp.com/moods', data)
  }

  service.getActivities = function(id) {
    return $http.get(`https://alisuehobbs-afloat.herokuapp.com/correlations/${id}`)
  }

  return service
});
