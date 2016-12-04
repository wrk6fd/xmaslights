// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http, $q){

        var googleMapService = {};

        var mapped = {};

        // googleMapService.clickLat  = 0;
        // googleMapService.clickLong = 0;
        // Array of locations obtained from API calls
        // var locations = [];
        // Handling Clicks and location selection
        // var currentSelectedMarker;

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return

        googleMapService.mapAddress = function(house, myLocation) {
            var geocoder = new google.maps.Geocoder();
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;

            var address = house.address.streetNumber + ' ' + house.address.streetName + ', ' +
                house.address.city + ', ' + house.address.state + ' ' + house.address.zip;

            geocoder.geocode({ 'address': address }, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    var mapOptions = {
                        zoom: 16,
                        center: results[0].geometry.location,
                        // disableDefaultUI: true
                    };

                    var map = new google.maps.Map(document.getElementById('map-' + house._id), mapOptions);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });

                    if(mapped[house._id] !== myLocation) {

                        mapped[house._id] = myLocation;
                        console.log(mapped);

                        directionsDisplay.setMap(map);
                        directionsDisplay.setPanel(null);
                        directionsDisplay.setPanel(document.getElementById('map-right-panel-' + house._id));

                        getDirections(directionsService, directionsDisplay, address, myLocation.name);
                    }
                } else {
                    console.log(status);
                }
            });
        };


        var getDirections = function(directionsService, directionsDisplay, house, myLocation) {
            var start = myLocation;
            var end = house;

            directionsService.route({
                origin: start,
                destination: end,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if(status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    console.log(response,status);
                }
            });

        };


        // // Functions
        // // --------------------------------------------------------------
        // // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        // googleMapService.refresh = function(latitude, longitude, filteredResults, house){
        //     console.log('refreshing');
        //
        //     // Clears the holding array of locations
        //     locations = [];
        //
        //     // Then convert the results into map points
        //     locations = convertToMapPoints(house);
        //
        //     // Then initialize the map
        //     initialize(latitude, longitude, false, house);
        //
        // };
        //
        // // Private Inner Functions
        // // --------------------------------------------------------------
        // // Convert a JSON of users into map points
        // var convertToMapPoints = function(house){
        //
        //     // Clear the locations holder
        //     locations = [];
        //
        //     // Create popup windows for each record
        //     var  contentString =
        //         '<p>' + house.address.streetNumber + ' ' + house.address.streetName + '</p>' +
        //         '<p>' + house.address.city + ', ' + house.address.state + ' ' + house.address.zip + '</p>';
        //
        //     // Converts each of the JSON records into Google Maps Location format (Note [Latitude, Longitude] format).
        //     locations.push({
        //         latlon: new google.maps.LatLng(house.location[1], house.location[0]),
        //         message: new google.maps.InfoWindow({
        //             content: contentString,
        //             maxWidth: 320
        //         })
        //     });
        //     // location is now an array populated with records in Google Maps format
        //     return locations;
        // };
        //
        // // Initializes the map
        // var initialize = function(latitude, longitude, filter, house) {
        //
        //     // Uses the selected latitude, longitude as starting point
        //     var myLatLng = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
        //
        //     // If map has not been created...
        //     // if (!map){
        //         // Create a new map and place in the index.html page
        //         var map = new google.maps.Map(document.getElementById('map-' + house._id), {
        //             zoom: 16,
        //             center: myLatLng
        //         });
        //     // }
        //
        //     // Blue dott
        //     icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        //
        //     // Loop through each location in the array and place a marker
        //     locations.forEach(function(n, i){
        //         var marker = new google.maps.Marker({
        //             position: n.latlon,
        //             map: map,
        //             title: "Big Map",
        //             icon: icon,
        //         });
        //
        //         // For each marker created, add a listener that checks for clicks
        //         google.maps.event.addListener(marker, 'click', function(e){
        //             // When clicked, open the selected marker's message
        //             currentSelectedMarker = n;
        //             n.message.open(map, marker);
        //         });
        //     });
        //
        //     // Function for moving to a selected location
        //     map.panTo(new google.maps.LatLng(latitude, longitude));
        // };

        googleMapService.fGeocode = function(address, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { "address": address }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location,
                        latitude      = location.lat(),
                        longitude      = location.lng();

                    return callback([longitude, latitude]); // Longitude, Latitude

                }
            });
        };
        googleMapService.rGeocode = function(latitude, longitude, callback) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(latitude, longitude);
            geocoder.geocode( { "latLng": latlng }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var streetNumber, streetName;
                    if(results[0].address_components[0].short_name) streetNumber = results[0].address_components[0].short_name;
                    if(results[0].address_components[1].short_name) streetName = results[0].address_components[1].short_name;

                    if(results[0].formatted_address.split(', ')[2]) {
                        // console.log(results[0]);
                        var location = results[0].formatted_address.split(', '),
                            // street = location[0],
                            city = location[1],
                            state = location[2].split(' ')[0],
                            zip = location[2].split(' ')[1];
                        return callback({
                            name: results[0].formatted_address,
                            address: {
                                streetNumber: streetNumber,
                                streetName: streetName,
                                city: city,
                                state: state,
                                zip: zip
                            }
                        });
                    }
                }
            });
        };


        // Refresh the page upon window load. Use the initial latitude and longitude
        // google.maps.event.addDomListener(window, 'load',
        //     googleMapService.refresh(selectedLat, selectedLong));
        //
        // google.maps.event.addDomListener(window, 'resize',
        //     googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });