// Creates the mainCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var mainCtrl = angular.module('mainCtrl', ['geolocation', 'gservice']);
mainCtrl.controller('mainCtrl', function($scope, $http, $rootScope, geolocation, gservice){

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
            ratings: [4,5,4,3,4,5],
            tags: ['Snowman', 'farm', 'trees', 'fun', 'clown', 'busy', 'happy'],
            created_at: new Date('Mon Nov 14 2016 09:40:36 GMT-0500 (EST)'),
            updated_at: new Date()
        }
    ];


    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    $scope.starRating1 = 4;

    $scope.click1 = function (param) {
        // console.log('Click(' + param + ')');
        var d = new Date();
        console.log(d);
    };
    //
    // $scope.mouseHover1 = function (param) {
    //     console.log('mouseHover(' + param + ')');
    //     $scope.hoverRating1 = param;
    // };
    //
    // $scope.mouseLeave1 = function (param) {
    //     console.log('mouseLeave(' + param + ')');
    //     $scope.hoverRating1 = param + '*';
    // };

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        // gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });
});