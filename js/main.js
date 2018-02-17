angular.module('luma', [])
    .controller('mainCtrl', function($scope,$http) {
        $scope.greeting = "Hello World";


        $http({
            method : "GET",
            url : "http://localhost:3000/",
        }).then(function mySuccess(response) {
            $scope.myWelcome = response.data;
            console.log(response);

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });


        $scope.sendNumber = function (patNum,lat,long){

          if(patNum<10){
            alert("Please enter at least 10 patients");
          }else{
            $http({
                method : "POST",
                url : "http://localhost:3000/run",
                headers:{
                  accept:'application/json'
                },
                data:{
                  patNum:patNum,
                  lat:lat,
                  long:long}
            }).then(function mySuccess(response) {
                $scope.mainList = response.data;
                console.log(response);

            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });

          }


        }

    });
