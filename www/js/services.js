angular.module('afloat.services', [])

.factory('AllServices', function($http) {
  var service = {}

  service.postNewUser = function(data) {
    return $http.post('https://alisuehobbs-afloat.herokuapp.com/signup', data)
  }

  service.loginUser = function(data) {
    return $http.post('https://alisuehobbs-afloat.herokuapp.com/login', data)
  }

  return service
});
