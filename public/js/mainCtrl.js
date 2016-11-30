// Creates the mainCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var mainCtrl = angular.module('mainCtrl', ['geolocation', 'gservice', 'AuthService']);
mainCtrl.controller('mainCtrl', function($scope, $http, focus, $rootScope, $timeout, geolocation, gservice, AuthService){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.houses = [
        {
            id: 1,
            nickname: 'Santa\'s Funhouse',
            pictures: ['img/christmas-house-1.jpg', 'img/christmas-lights.jpg'],
            address: {
                street: '13548 Gray Bill Court',
                city: 'Clifton',
                state: 'VA',
                zip: '20124'
            },
            location: [-77.414032, 38.837635], //Long, Lat
            comments: [
                {
                    id: 1,
                    text: 'Awesome lights!',
                    time: new Date('Tue Nov 1 2016 06:25:36 GMT-0500 (EST)')
                },
                {
                    id: 2,
                    text: 'Mesmerizing!',
                    time: new Date('Thu Nov 17 2016 06:25:36 GMT-0500 (EST)')
                }
            ],
            ratings: [4,5,4,3,4,5],
            // ratings: 5,
            tags: ['Lights', 'Santa', 'Busy', 'happy'],
            created_at: new Date('Wed Nov 16 2016 09:25:36 GMT-0500 (EST)'),
            updated_at: new Date()
        },
        {
            id: 2,
            nickname: 'Tree Farm',
            pictures: ['img/xmas_lights_house.jpg'],
            address: {
                street: '5820 Waterdale Ct',
                city: 'Centreville',
                state: 'VA',
                zip: '20121'
            },
            location: [-77.419983, 38.833945], //Long, Lat
            comments: [
                {
                    id: 1,
                    text: 'Trees look incredible!',
                    time: new Date('Tue Nov 1 2016 11:37:36 GMT-0500 (EST)')
                },
                {
                    id: 2,
                    text: 'Must have been a lot of work!',
                    time: new Date('Thu Nov 17 2016 09:56:36 GMT-0500 (EST)')
                }
            ],
            ratings: [1,2,3,1,1,2],
            // ratings: 3,
            tags: ['Snowman', 'farm', 'trees', 'fun', 'clown', 'busy', 'happy'],
            created_at: new Date('Mon Nov 14 2016 09:40:36 GMT-0500 (EST)'),
            updated_at: new Date()
        }
    ];

    $scope.error = {};

    $scope.registerIsOpen = false;
    $scope.registerForm = {
        username: '',
        password: ''
    };
    $scope.loginIsOpen = false;
    $scope.loginForm = {
        username: '',
        password: ''
    };

    $scope.newHouseCollapse = true;
    $scope.commentCollapse = true;
    $scope.newHouseRating = 5;

    $scope.isFocused = false;

    $scope.myLocation = {};
    $scope.newHouse = {};

    $scope.registrationPopover = {
        templateUrl: 'registration.html'
    };
    $scope.loginPopover = {
        templateUrl: 'login.html'
    };

    var coords = {};
    var lat = 0;
    var long = 0;

    $scope.starRating1 = 4;
    $scope.ratingMsg = [];

    $scope.geoBased = true;

    $scope.register = function() {
        // initial values
        $scope.error.register = '';

        // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
            .then(function () {
                $scope.cancelRegistration();
                //login and success message toastr
            })
            // handle error
            .catch(function () {
                $scope.error.register = 'We can\'t register you right now. Try again in a little while';
            });

    };

    $scope.cancelRegistration = function() {
        $scope.registerForm = {};
        $scope.registerIsOpen = false;
    };

    $scope.login = function () {

        // initial values
        $scope.error.login = '';

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
            .then(function (data) {
                $scope.cancelLogin();
                console.log(data);
                // AuthService.getUserStatus()
                //     .success(function (data) {
                //         console.log(data);
                //         if(data.status){
                //             console.log(data);
                //             // user = true;
                //             user = data.user;
                //             console.log(user);
                //         } else {
                //             console.log('no-status',data);
                //             user = false;
                //         }
                //     })
                //     // handle error
                //     .error(function (data) {
                //         user = false;
                //     });
            })
            // handle error
            .catch(function () {
                $scope.error.login = "Incorrect username and/or password";
            });

    };

    $scope.cancelLogin = function() {
        $scope.loginForm = {};
        $scope.loginIsOpen = false;
        AuthService.getUserStatus()
            .then(function(){
                if (!AuthService.isLoggedIn()){
                    console.log('not logged in');
                } else {
                    console.log('logged in');
                }
            });
    };


    $scope.toggleCollapse = function(){
        $scope.newHouseCollapse = !$scope.newHouseCollapse;
        if(!$scope.newHouseCollapse) focus('new-street-input');
    };

    $scope.addRating = function(house_id,rating) {
        var index = _.findIndex($scope.houses, ['_id', house_id]);
        if(!$scope.houses[index].hasOwnProperty('ratings')) {
            $scope.houses[index].ratings = [];
        }
        $scope.houses[index].ratings.push(rating);
        $scope.houses[index].avgRating = _.round(_.mean($scope.houses[index].ratings),1);

        $scope.ratingMsg[index] = 'Thanks for the ' + rating + ' snowflake rating!';
        setTimeout(function() {
            $scope.ratingMsg[index] = 'Average Rating: ' + $scope.houses[index].avgRating + ' Snowflakes';
        }, 6000);

        // save house
        console.log($scope.houses[index]);
        $http.put('/houses', $scope.houses[index])
            .success(function(data) {
                console.log('saved',data);
            })
            .error(function(data) {
                console.error(data);
            });
    };

    $scope.setRating = function(param) {
        $scope.newHouse.ratings = [];
        $scope.newHouse.ratings.push(param);
    };
    $scope.setValue = function(param) {
        $scope.value = param;
    };

    $scope.getAllHouses = function() {
        $http.get('/houses')
            .success(function(data) {
                // console.log(data);
                $scope.houses = data;
                for(var i = 0; i < $scope.houses.length; i++) {
                    if(!$scope.houses[i].hasOwnProperty('ratings')) {
                        $scope.houses[i].ratings = [];
                    }
                    $scope.houses[i].avgRating = _.round(_.mean($scope.houses[i].ratings),1);
                    $scope.ratingMsg[i] = 'Average Rating: ' + ($scope.houses[i].avgRating || 0) + ' Snowflakes';
                }
            })
            .error(function(data) {
               console.error(data);
            });
    };
    $scope.getAllHouses();

    $scope.addHouse = function() {
        if($scope.file) {
            var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;
            if(!$scope.newHouse.ratings) {
                $scope.newHouse.ratings = [];
                $scope.newHouse.ratings.push($scope.newHouseRating);
            }
            $scope.newHouse.pictures = [];
            $scope.newHouse.pictures.push('https://s3.amazonaws.com/house-picture-uploads/' + uniqueFileName);
            console.log('uploading',$scope.newHouse);
            $http.post('/houses', $scope.newHouse)
                .success(function(data) {
                    console.log('added',data);
                    $scope.upload(uniqueFileName, data._id);

                    setTimeout(function() {
                        $scope.houses.push(data);
                    }, 1000);
                })
                .error(function(data) {
                    console.error(data);
                });
        } else {
            $scope.error.file = 'Don\'t forget to upload a picture to share'
        }
    };

    $scope.sizeLimit      = 3*10585760; // 30MB in Bytes
    $scope.uploadProgress = 0;
    //l4DhYwjJvHdXkmruk32ZYPLGu039ZGLQpwjE9NqL
    //AKIAJNWEOZKVKAYI4YRA
    $scope.upload = function(fileName, failure_id) {
        AWS.config.update({ accessKeyId: 'AKIAJNWEOZKVKAYI4YRA', secretAccessKey: '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' });
        AWS.config.region = 'us-east-1';
        var bucket = new AWS.S3({ params: { Bucket: 'house-picture-uploads' } });
        console.log($scope.file);
        if($scope.file) {
            // Perform File Size Check First
            var fileSize = Math.round(parseInt($scope.file.size));
            if (fileSize > $scope.sizeLimit) {
                // toastr.error('Sorry, your attachment is too big. <br/> Maximum '  + $scope.fileSizeLabel() + ' file attachment allowed','File Too Large');
                console.error('Sorry, your attachment is too big.','File Too Large');
                return false;
            }
            // Prepend Unique String To Prevent Overwrites
            // var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;
            // var uniqueFileName = house_id + '-' + $scope.file.name;

            var params = { Key: fileName, ContentType: $scope.file.type, Body: $scope.file, ACL: 'public-read' };

            bucket.putObject(params, function(err, data) {
                if(err) {
                    console.error(err.message, err.code);
                    // toastr.error(err.message,err.code);
                    return false;
                }
                else {
                    // Upload Successfully Finished
                    // toastr.success('File Uploaded Successfully', 'Done');
                    console.log('success');
                    if(failure_id) {
                        $scope.newHouseCollapse = true;
                        $scope.newHouse = {};
                    }

                    // Reset The Progress Bar
                    setTimeout(function() {
                        $scope.uploadProgress = 0;
                        $scope.$digest();
                    }, 4000);
                }
            })
                .on('httpUploadProgress',function(progress) {
                    $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                    $scope.$digest();
                });
        }
        else {
            // No File Selected
            // toastr.error('Please select a file to upload');
            console.error('Please select a file to upload');
        }
    };


    // Set initial coordinates to the center of the US
    // $scope.myLocation.latitude = 39.500;
    // $scope.myLocation.longitude = -98.350;

    // Get User's actual coordinates based on HTML5 at window load
    $scope.setMyLocation = function() {
        geolocation.getLocation().then(function(data){

            // Set the latitude and longitude equal to the HTML5 coordinates
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            // Display coordinates in location textboxes rounded to six decimal points
            $scope.myLocation.longitude = parseFloat(coords.long).toFixed(6);
            $scope.myLocation.latitude = parseFloat(coords.lat).toFixed(6);

            // console.log($scope.myLocation);
            // gservice.refresh($scope.myLocation.latitude, $scope.myLocation.longitude);

            gservice.rGeocode($scope.myLocation.latitude, $scope.myLocation.longitude, function(address){
                $scope.newHouse.address = address;
                console.log($scope.newHouse);
            });

        });
    };
    $scope.setMyLocation();

    $scope.toggleComment = function(cancel) {
        $scope.commentCollapse = !$scope.commentCollapse;
        if(cancel) {
            $scope.comment = {
                user: '',
                text: ''
            }
        }
    };

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.myLocation.latitude = parseFloat(gservice.clickLat).toFixed(6);
            $scope.myLocation.longitude = parseFloat(gservice.clickLong).toFixed(6);
            $scope.myLocation.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });


    $scope.uniqueString = function() {
        var text     = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 8; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

}).
directive('file', function() {
    return {
        restrict: 'AE',
        scope: {
            file: '@'
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                console.log(files);
                var file = files[0];
                scope.file = file;
                scope.$parent.file = file;
                scope.$apply();
            });
        }
    };
})
    .factory('focus', function($timeout, $window) {
        return function(id) {
            // timeout makes sure that is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if(element) {
                    element.focus();
                }
            });
        };
    })

    .directive('eventFocus', function(focus) {
        return function(scope, elem, attr) {
            elem.on(attr.eventFocus, function() {
                focus(attr.eventFocusId);
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function() {
                element.off(attr.eventFocus);
            });
        };
    });
