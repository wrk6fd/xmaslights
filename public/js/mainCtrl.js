// Creates the mainCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var mainCtrl = angular.module('mainCtrl', ['geolocation', 'gservice', 'AuthService', 'toastr']);
mainCtrl.controller('mainCtrl', function($scope, $q, $window, $http, focus, $rootScope, $timeout, geolocation, gservice, AuthService, toastr){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    // $scope.houses = [
    //     {
    //         id: 1,
    //         nickname: 'Santa\'s Funhouse',
    //         pictures: ['img/christmas-house-1.jpg', 'img/christmas-lights.jpg'],
    //         address: {
    //             streetNumber: '13548',
    //             streetName: 'Gray Bill Court',
    //             city: 'Clifton',
    //             state: 'VA',
    //             zip: '20124'
    //         },
    //         location: [-77.414032, 38.837635], //longitude, latitude
    //         comments: [
    //             {
    //                 id: 1,
    //                 text: 'Awesome lights!',
    //                 time: new Date('Tue Nov 1 2016 06:25:36 GMT-0500 (EST)')
    //             },
    //             {
    //                 id: 2,
    //                 text: 'Mesmerizing!',
    //                 time: new Date('Thu Nov 17 2016 06:25:36 GMT-0500 (EST)')
    //             }
    //         ],
    //         ratings: [4,5,4,3,4,5],
    //         // ratings: 5,
    //         tags: ['Lights', 'Santa', 'Busy', 'happy'],
    //         created_at: new Date('Wed Nov 16 2016 09:25:36 GMT-0500 (EST)'),
    //         updated_at: new Date()
    //     },
    //     {
    //         id: 2,
    //         nickname: 'Tree Farm',
    //         pictures: ['img/xmas_lights_house.jpg'],
    //         address: {
    //             streetNumber: '5820',
    //             streetName: 'Waterdale Ct',
    //             city: 'Centreville',
    //             state: 'VA',
    //             zip: '20121'
    //         },
    //         location: [-77.419983, 38.833945], //longitude, latitude
    //         comments: [
    //             {
    //                 id: 1,
    //                 text: 'Trees look incredible!',
    //                 time: new Date('Tue Nov 1 2016 11:37:36 GMT-0500 (EST)')
    //             },
    //             {
    //                 id: 2,
    //                 text: 'Must have been a lot of work!',
    //                 time: new Date('Thu Nov 17 2016 09:56:36 GMT-0500 (EST)')
    //             }
    //         ],
    //         ratings: [1,2,3,1,1,2],
    //         // ratings: 3,
    //         tags: ['Snowman', 'farm', 'trees', 'fun', 'clown', 'busy', 'happy'],
    //         created_at: new Date('Mon Nov 14 2016 09:40:36 GMT-0500 (EST)'),
    //         updated_at: new Date()
    //     }
    // ];
    $scope.houses = [];

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
    $scope.locationIsOpen = false;
    $scope.locationForm = {
        myLocation: '',
        location: {}
    };

    $scope.filterCollapse = true;
    $scope.newHouseCollapse = true;
    $scope.commentCollapse = {};
    $scope.newHouseRating = 5;

    $scope.isFocused = false;

    $scope.myLocation = {};
    $scope.newHouse = {};

    $scope.filterError = '';

    $scope.registrationPopover = {
        templateUrl: 'registration.html'
    };

    $scope.loginPopover = {
        templateUrl: 'login.html'
    };
    $scope.myLocationPopover = {
        templateUrl: 'location.html'
    };

    var coords = {};
    var latitude = 0;
    var longitude = 0;

    $scope.starRating1 = 4;
    $scope.ratingMsg = {};

    $scope.geoBased = true;

    $scope.isLoggedIn = false;
    $scope.currentUser = null;

    $scope.mapCollapse = {};

    $scope.filter = {
        name: '',
        place: '',
        streetNumber: '',
        streetName: '',
        city: '',
        state: '',
        zip: '',
        location: {
            latitude: '',
            longitude: ''
        },
        distance: '',
        snow5: '',
        snow4: '',
        snow3: '',
        snow2: '',
        snow1: ''
    };

    $scope.directions = {};

    $scope.sortBy = 1;

    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
        $scope.isLoggedIn = isLoggedIn;
        $scope.currentUser = AuthService.currentUser();
    });

    $scope.$watch('loginIsOpen', function(value) {
        if(value) {
            focus('login-username');
        }
    });
    $scope.$watch('registerIsOpen', function(value) {
        if(value) {
            focus('register-username');
        }
    });
    $scope.$watch('locationIsOpen', function(value) {
        if(value) {
            focus('location');
        }
    });

    var queryBody = {};
    var lastQuery = [];
    $scope.getResults = function() {
        if($scope.filterForm.filterAddress.$invalid) {
            toastr.error('Make sure you enter a valid address');
            $scope.filterError = 'Make sure you enter a valid address';
        } else {
            $scope.filterError = '';
            queryBody = {
                address: {
                    streetNumber: $scope.filter.streetNumber,
                    streetName: $scope.filter.streetName,
                    city: $scope.filter.city,
                    state: $scope.filter.state,
                    zip: $scope.filter.zip
                },
                // location: $scope.filter.location, // latitude, longitude
                location: {
                    latitude: $scope.filter.latitude,
                    longitude: $scope.filter.longitude
                },
                distance: $scope.filter.distance,
                rating5: $scope.filter.snow5,
                rating4: $scope.filter.snow4,
                rating3: $scope.filter.snow3,
                rating2: $scope.filter.snow2,
                rating1: $scope.filter.snow1,
                sortBy: $scope.sortBy
            };


            if(!queryBody.distance) {
                queryBody.distance = 50;
            }

            if(queryBody.sortBy === 1 && !queryBody.location) {
                // queryBody.location = $scope.myLocation.location;
                queryBody.location = {};
                queryBody.location.longitude = $scope.myLocation.longitude;
                queryBody.location.latitude = $scope.myLocation.latitude;

            }

            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', queryBody)

            // Store the filtered results in queryResults
                .success(function(queryResults){

                    lastQuery = queryResults;

                    // gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;

                    $scope.houses = [];
                    $scope.houses = queryResults;
                    // toastr.info('Houses updated!');
                    $scope.toggleFilter();
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                });
        }
    };

    $scope.cancelFilter = function() {
        $scope.toggleFilter();
    };

    $scope.clearFilter = function() {
        $scope.filter = {};
    };

    $scope.checkIfEnterKeyWasPressed = function($event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            if($scope.loginIsOpen) {
                $scope.login();
            } else if($scope.registerIsOpen) {
                $scope.register();
            }
        }
    };

    $scope.register = function() {
        // initial values
        $scope.error.register = '';

        if($scope.registerForm.username === '' || $scope.registerForm.password === '') {
            $scope.error.register = 'Please enter both username and password';
        } else {
            // call register from service
            AuthService.register($scope.registerForm.username, $scope.registerForm.password)
            // handle success
                .then(function () {
                    // $scope.loginForm.username = $scope.registerForm.username;
                    // $scope.loginForm.password = $scope.registerForm.password;
                    toastr.success('Your account has been created!');
                    $scope.login($scope.registerForm.username, $scope.registerForm.password);
                    $scope.cancelRegistration();
                    //login and success message toastr
                })
                // handle error
                .catch(function () {
                    $scope.error.register = 'We can\'t register you right now. Try again in a little while';
                    toastr.error('One of our light bulbs burnt out. We\'ll get another one as quick as possible');
                });
        }


    };

    $scope.cancelRegistration = function() {
        $scope.registerForm = {};
        $scope.registerIsOpen = false;
        $scope.error.register = '';
    };

    $scope.login = function (un,pw) {
        var message = 'Welcome back, ';
        var username = $scope.loginForm.username;
        var password = $scope.loginForm.password;
        if(un && pw) {
            message = 'Welcome, ';
            username = un;
            password = pw;
        }
        // initial values
        $scope.error.login = '';
        if(username === '' || password === '') {
            $scope.error.login = 'Please enter both username and password';
        } else {
            // call login from service
            AuthService.login(username, password)
            // handle success
                .then(function () {
                    $scope.cancelLogin();
                    toastr.info(message + username + '!');
                    // console.log('successfully logged in');
                })
                // handle error
                .catch(function () {
                    $scope.error.login = 'Your username or password is incorrect. Try again';
                });
        }


    };

    $scope.cancelLogin = function() {
        $scope.loginForm = {};
        $scope.loginIsOpen = false;
        $scope.error.login = '';
    };

    $scope.logout = function() {
        AuthService.logout();
    };

    $scope.toggleFilter = function() {
        $scope.filterCollapse = !$scope.filterCollapse;
        if(!$scope.filterCollapse) {
            if(!$scope.newHouseCollapse) $scope.toggleCollapse();
            $scope.filter = $scope.myLocation;
            // $scope.filter.distance = 10;
            // $scope.sortBy = 1;
            setTimeout(function() {
                focus('filterAddress');
            }, 1000);
            $scope.filterError = '';
        } else if($scope.filterCollapse) {
            $scope.filter = {
                name: '',
                place: '',
                streetNumber: '',
                streetName: '',
                city: '',
                state: '',
                zip: '',
                location: {
                    latitude: '',
                    longitude: ''
                },
                distance: '',
                snow5: '',
                snow4: '',
                snow3: '',
                snow2: '',
                snow1: ''
            };
        }
    };


    $scope.toggleCollapse = function(){
        $scope.newHouseCollapse = !$scope.newHouseCollapse;
        if(!$scope.newHouseCollapse) {
            if(!$scope.filterCollapse) $scope.toggleFilter();
            setTimeout(function() {
                focus('newHouseAddress');
            }, 1000);
            $scope.houseError = '';
            $window.scrollTo(0, 0);
        }
    };

    $scope.addRating = function(house_id,rating) {
        var index = _.findIndex($scope.houses, ['_id', house_id]);
        if(!$scope.houses[index].hasOwnProperty('ratings')) {
            $scope.houses[index].ratings = [];
        }
        $scope.houses[index].ratings.push(rating);
        $scope.houses[index].avgRating = _.round(_.mean($scope.houses[index].ratings),1);

        $scope.ratingMsg[house_id] = 'Thanks for the ' + rating + ' snowflake rating!';
        setTimeout(function() {
            $scope.ratingMsg[house_id] = 'Average Rating: ' + $scope.houses[index].avgRating + ' Snowflakes';
        }, 6000);

        // save house
        $http.put('/houses', $scope.houses[index])
            .success(function(data) {
                // console.log('Rated!');
                toastr.success('Thanks for the rating!');
            })
            .error(function(data) {
                // console.error(data);
                toastr.error('One of our light bulbs burnt out. We\'ll get another one as quick as possible');
                //toastr or or handleError
            });
    };

    $scope.setRating = function(param) {
        $scope.newHouse.ratings = [];
        $scope.newHouse.ratings.push(param);
    };
    $scope.setValue = function(param) {
        $scope.value = param;
    };

    $scope.getHousesUrl = function() {
        if($scope.myLocation) {
            // console.log('using my location', $scope.myLocation);
            return $http.get('/houses', { params: { latitude: $scope.myLocation.latitude, longitude: $scope.myLocation.longitude } });
        } else {
            return $http.get('/houses');
        }
    };

    $scope.getAllHouses = function() {
        // console.log($scope.myLocation);
        $scope.getHousesUrl()
            .success(function(data) {
                // console.log(data);
                $scope.houses = data;
                for(var i = 0; i < $scope.houses.length; i++) {
                    if(!$scope.houses[i].hasOwnProperty('ratings')) {
                        $scope.houses[i].ratings = [];
                    }
                    $scope.commentCollapse[$scope.houses[i]._id] = true;
                    $scope.houses[i].comment = {
                        text: '',
                        user: '',
                        time: ''
                    };
                    $scope.houses[i].avgRating = _.round(_.mean($scope.houses[i].ratings),1);
                    $scope.ratingMsg[$scope.houses[i]._id] = 'Average Rating: ' + ($scope.houses[i].avgRating || 0) + ' Snowflakes';
                    $scope.mapCollapse[$scope.houses[i]._id] = true;
                    $scope.directions[$scope.houses[i]._id] = false;
                }
                $scope.loadingHouses = false;
            })
            .error(function(data) {
               toastr.error('We can\'t find the light switch right now. Don\'t worry, we\'ll find it soon!')
            });
    };

    $scope.addHouse = function() {
        if($scope.newHouseForm.newHouseAddress.$invalid) {
            toastr.error('Make sure you enter a valid address');
            $scope.houseError = 'Make sure you enter a valid address';
        } else {
            $scope.houseError = '';
            if ($scope.file) {
                console.log('starting to add house');
                var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;
                if (!$scope.newHouse.ratings) {
                    $scope.newHouse.ratings = [];
                    $scope.newHouse.ratings.push($scope.newHouseRating);
                }
                $scope.newHouse.avgRating = $scope.newHouseRating;
                // $scope.newHouse.location = [];
                // var addrStr = $scope.newHouse.address.street + ', ' + $scope.newHouse.address.city + ', ' + $scope.newHouse.address.state + ' ' + $scope.newHouse.address.zip;
                // gservice.fGeocode(addrStr, function(lngLat) {
                //     $scope.newHouse.location =  lngLat;

                // $scope.newHouse.address.street = ($scope.newHouse.address.streetNumber ? $scope.newHouse.address.streetNumber + ' ' + $scope.newHouse.address.streetName : $scope.filter.streetName),
                $scope.newHouse.location = [];
                $scope.newHouse.location.push($scope.newHouse.longitude);
                $scope.newHouse.location.push($scope.newHouse.latitude);

                $scope.newHouse.pictures = [];
                $scope.newHouse.pictures.push('https://s3.amazonaws.com/house-picture-uploads/' + uniqueFileName);

                $http.post('/houses', $scope.newHouse)
                    .success(function (data) {
                        $scope.upload(uniqueFileName, data, true);
                    })
                    .error(function (data) {
                        toastr.error('Something\'s not quite right. Try again later');
                    });

                // });


            } else {
                $scope.error.file = 'Don\'t forget to upload a picture to share';
                toastr.error($scope.error.file);
            }
        }
    };

    $scope.sizeLimit      = 3*10585760; // 30MB in Bytes
    // $scope.uploadProgress = 0;
    //l4DhYwjJvHdXkmruk32ZYPLGu039ZGLQpwjE9NqL
    //AKIAJNWEOZKVKAYI4YRA
    $scope.upload = function(fileName, house, newHouse) {
        AWS.config.update({ accessKeyId: 'AKIAJNWEOZKVKAYI4YRA', secretAccessKey: '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' });
        AWS.config.region = 'us-east-1';
        var bucket = new AWS.S3({ params: { Bucket: 'house-picture-uploads' } });
        // console.log($scope.file);
        if($scope.file) {
            // Perform File Size Check First
            var fileSize = Math.round(parseInt($scope.file.size));
            if (fileSize > $scope.sizeLimit) {
                // toastr.error('Sorry, your attachment is too big. <br/> Maximum '  + $scope.fileSizeLabel() + ' file attachment allowed','File Too Large');
                toastr.error('Sorry, your picture is too big. Try a smaller one','Picture Larger than 30MB');
                return false;
            }
            // Prepend Unique String To Prevent Overwrites
            // var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;
            // var uniqueFileName = house_id + '-' + $scope.file.name;

            var params = { Key: fileName, ContentType: $scope.file.type, Body: $scope.file, ACL: 'public-read' };

            bucket.putObject(params, function(err, data) {
                if(err) {
                    // delete failure_house._id
                    toastr.error('Something\'s not quite right. Try again later');
                    return false;
                }
                else {
                    if(newHouse) {
                        // Upload Successfully Finished
                        // toastr.success('File Uploaded Successfully', 'Done');
                        // $scope.houses.push(house);

                        $scope.houses = _.concat([house],$scope.houses);

                        $scope.commentCollapse[house._id] = true;
                        $scope.mapCollapse[house._id] = true;
                        $scope.ratingMsg[house._id] = 'Average Rating: ' + (house.avgRating || 0) + ' Snowflakes';
                        $scope.newHouseCollapse = true;
                        $scope.newHouse = $scope.myLocation;
                        toastr.success('New house added!');
                    }
                    $scope.file = null;
                }
            });
        }
        else {
            // No File Selected
            toastr.error('Please select a picture to upload');
        }
    };


    $scope.cancelNewHouse = function() {
        $scope.toggleCollapse();
    };

    // Set initial coordinates to the center of the US
    // $scope.myLocation.latitude = 39.500;
    // $scope.myLocation.longitude = -98.350;

    $scope.getCurrentPosition = function() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
            console.log('Location is unavailable');
            deferred.reject('Geolocation not supported.');
        } else {
            // console.log('something is wrong');
            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    deferred.resolve(position);
                },
                function (err) {
                    console.log('Current Location is unavailable');
                    deferred.reject(err);
                });
        }

        return deferred.promise;
    };

    $scope.captureUserLocation = function() {
       $scope.getCurrentPosition().then(function(data) {
           $scope.setMyLocation(true)
       }, function(err) {
           $scope.setMyLocation(true,true)
       });
    };

        // Get User's actual coordinates based on HTML5 at window load
    $scope.setMyLocation = function(getHouses, noLocation) {
        if(getHouses) $scope.loadingHouses = true;

        // if(customLocation) {
        //     console.log(customLocation);
        //     $scope.myLocation.longitude = parseFloat(customLocation.longitude).toFixed(6);
        //     $scope.myLocation.latitude = parseFloat(customLocation.longitude).toFixed(6);
        //
        //     $scope.myLocation.address = {
        //         streetNumber: customLocation.streetNumber,
        //         streetName: customLocation.streetName,
        //         city: customLocation.city,
        //         state: customLocation.state
        //     };
        //
        //     $scope.myLocation.name = customLocation.myLocation;
        //
        //     // $scope.newHouse.name = $scope.myLocation.name;
        //     $scope.newHouse.address = $scope.myLocation.address;
        //
        //     $scope.newHouse.location = [];
        //     $scope.newHouse.location.push($scope.myLocation.longitude);
        //     $scope.newHouse.location.push($scope.myLocation.latitude);
        //     $scope.newHouse.longitude = $scope.myLocation.longitude;
        //     $scope.newHouse.latitude = $scope.myLocation.latitude;
        //
        //     if(getHouses) $scope.getAllHouses();
        // } else {

        if(noLocation){
            if(getHouses) $scope.getAllHouses();
        } else {
            geolocation.getLocation().then(function (data) {

                // Set the latitude and longitude equal to the HTML5 coordinates
                coords = {latitude: data.coords.latitude, longitude: data.coords.longitude};

                // Display coordinates in location textboxes rounded to six decimal points
                // $scope.myLocation.location = {
                //     longitude: parseFloat(coords.longitude).toFixed(6),
                //     latitude: parseFloat(coords.latitude).toFixed(6)
                // };
                $scope.myLocation.longitude = parseFloat(coords.longitude).toFixed(6);
                $scope.myLocation.latitude = parseFloat(coords.latitude).toFixed(6);

                // gservice.refresh($scope.myLocation.latitude, $scope.myLocation.longitude);

                gservice.rGeocode($scope.myLocation.latitude, $scope.myLocation.longitude, function (geoLocation) {
                    $scope.myLocation.address = geoLocation.address;
                    $scope.myLocation.name = geoLocation.name;

                    $scope.newHouse.name = geoLocation.name;
                    $scope.newHouse.address = geoLocation.address;

                    $scope.newHouse.location = [];
                    $scope.newHouse.location.push($scope.myLocation.longitude);
                    $scope.newHouse.location.push($scope.myLocation.latitude);
                    $scope.newHouse.longitude = $scope.myLocation.longitude;
                    $scope.newHouse.latitude = $scope.myLocation.latitude;

                    if (getHouses) $scope.getAllHouses();

                });

            });
        }
    };
    // $scope.setMyLocation(true);
    $scope.captureUserLocation();

    $scope.showMap = function(house, directions) {
        if(!directions) {
            $scope.mapCollapse[house._id] = !$scope.mapCollapse[house._id];
        }
        gservice.mapAddress(house, $scope.myLocation, directions);
        // gservice.refresh(house.location[1], house.location[0], null, house);
    };

    $scope.getDirections = function(house) {
        if(!$scope.myLocation) {
            toastr.warning('Set your location so we can give you directions');
        } else if($scope.myLocation) {
            $scope.directions[house._id] = true;
            $scope.showMap(house, true);
        }
    };

    $scope.toggleComment = function(house) {
        $scope.commentCollapse[house._id] = !$scope.commentCollapse[house._id];
        house.comment = {
            user: '',
            text: ''
        };
        if(!$scope.commentCollapse[house._id] && $scope.isLoggedIn && $scope.currentUser) {
            focus('comment-body-' + house._id);
        }
    };


    // comments: [{
    //     id: {type: Number, required: false},
    //     text: {type: [String], required: false},
    //     user: {type: [String], required: false},
    //     time: {type: Date, default: new Date()}
    // }],
    $scope.enterPostComment = function($event, house) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13 && $event.shiftKey) {
            $event.stopPropagation();
            $scope.postComment(house);
        }
    };

    $scope.postComment = function(house) {
        if(house.comment.text !== '') {
            // house.comment.user = 'test user';
            house.comment.user = $scope.currentUser;
            house.comment.time = new Date();
            house.comments.push(house.comment);
            delete house.comment;
            $http.put('/houses', house)
                .success(function(data) {
                    toastr.success('Thanks for the comment!');
                })
                .error(function(data) {
                    toastr.error('Something\'s not quite right. Try again later');
                });
        }
    };

    $scope.cancelComment = function(house) {
        house.comment.text = '';
    };

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    // $rootScope.$on("clicked", function(){
    //
    //     // Run the gservice functions associated with identifying coordinates
    //     $scope.$apply(function(){
    //         $scope.myLocation.latitude = parseFloat(gservice.clickLat).toFixed(6);
    //         $scope.myLocation.longitude = parseFloat(gservice.clickLong).toFixed(6);
    //         $scope.myLocation.htmlverified = "Nope (Thanks for spamming my map...)";
    //     });
    // });


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
    })

    .directive('googleplace', function() {
        return {
            require : 'ngModel',
            link : function(scope, element, attrs, model) {
                var options = {
                    types : [],
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0],
                    options);

                google.maps.event.addListener(scope.gPlace, 'place_changed',
                    function() {
                        scope.$apply(function() {
                            model.$setViewValue(element.val());
                        });
                    });
            }
        };
    });
