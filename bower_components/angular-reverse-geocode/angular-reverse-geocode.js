/**
 * AngularJS reverse geocoding directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.0.0
 */
(function () {
    angular.module('angularReverseGeocode', [])
    .directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            console.log(results[0]);
                            if(results[0].formatted_address.split(', ')[2]) {
                                element.html(
                                    '<div class="address">' +
                                    '<div class="street">' + results[0].formatted_address.split(', ')[0] + '</div>' +
                                    '<div class="city-state-zip">' + results[0].formatted_address.split(', ')[1] + ', ' +
                                    results[0].formatted_address.split(', ')[2] + '</div>' +
                                    '</div>'
                                );
                            }
                        } else {
                            element.text('We can\'t find your current location\n Try manually entering your location');
                        }
                    } else {
                        element.text('We can\'t find your current location\n Try manually entering your location');
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            },
            replace: true
        }
    });
})();