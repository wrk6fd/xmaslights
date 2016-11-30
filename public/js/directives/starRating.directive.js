angular.module('rating', []).directive('houseRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'A',
        templateUrl: 'js/directives/starRating.directive.html',
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            }
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            }

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;
                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;
                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
}).
directive('initialRating', function () {
    return {
        scope: {
            snowRating: '=',
            snowMaxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'A',
        templateUrl: 'js/directives/initialRating.directive.html',
        compile: function (element, attrs) {
            if (!attrs.snowMaxRating || (Number(attrs.snowMaxRating) <= 0)) {
                attrs.snowMaxRating = '5';
            }
        },
        controller: function ($scope, $element, $attrs) {
            $scope.snowMaxRatings = [];

            for (var i = 1; i <= $scope.snowMaxRating; i++) {
                $scope.snowMaxRatings.push({});
            }

            $scope._snowRating = $scope.snowRating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;
                $scope.snowRating = $scope._snowRating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;
                $scope._snowRating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._snowRating = $scope.snowRating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});