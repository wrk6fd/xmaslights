// Dependencies
var mongoose        = require('mongoose');
var House            = require('./house');
var User            = require('./user');
var passport        = require('passport');
var _                = require('lodash');
//https://www.hacksparrow.com/the-mongodb-tutorial.html
//http://mongoosejs.com/docs/2.7.x/docs/query.html
//http://mongoosejs.com/docs/queries.html


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/houses', function(req, res){
        // console.log(req.query);

        var latitude, longitude;

        // Uses Mongoose schema to run the search (empty conditions)
        var query = House.find({});
        // console.log('connecting to mongodb');

        if(req.query) {
            latitude = parseFloat(req.query.latitude);
            longitude = parseFloat(req.query.longitude);

            // console.log(longitude, latitude);

            query = query.where('location').near({ center: {type: 'Point', coordinates: [longitude, latitude]},
                spherical: true});
        }

        query.exec(function(err, houses){
            // console.log('still connecting...');
            if(err) {
                console.log(err);
                res.send(err);
            }
            // console.log(houses);
            // If no errors are found, it responds with a JSON of all users
            res.json(houses);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/houses', function(req, res){

        // Creates a new House based on the Mongoose schema and the post body
        var newHouse = new House(req.body);
        console.log('new house', newHouse);

        // New House is saved in the db.
        newHouse.save(function(err,house){
            if(err) {
                console.log(err);
                res.send(err);
            }

            // If no errors are found, it responds with a JSON of the new user
            // console.log('new house',house);
            res.json(house);
        });
    });

    app.put('/houses', function(req, res){
        var updatedHouse = new House(req.body),
            house_id = updatedHouse._id;

        var obj = updatedHouse.toObject();
        delete updatedHouse._id;

        var query = House.update({_id: house_id}, obj, function(err, house) {
            if(err) {
                res.send(err);
            } else {
                res.json(house);
            }
        })
    });

    app.post('/register', function(req, res) {
        User.register(new User({ username: req.body.username }),
            req.body.password, function(err, account) {
                if (err) {
                    return res.status(500).json({
                        err: err
                    });
                }
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                        status: 'Registration successful!'
                    });
                });
            });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }
                console.log(user, ' logged in');
                var retUser = user;
                retUser.hash = '';
                retUser.salt = '';
                res.status(200).json({
                    user: retUser,
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });

    app.get('/user/status', function(req, res) {
        console.log('user',req.user);
        if (!req.isAuthenticated()) {
            return res.status(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true,
            user: req.user.username
        });
    });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query', function(req, res){

        // Grab all of the query parameters from the body.

        // queryBody = {
        //     queryBody = {
        //         // name: $scope.filter.name,
        //         // place: $scope.filter.place,
        //         streetNumber: $scope.filter.streetNumber,
        //         streetName: $scope.filter.streetName,
        //         city: $scope.filter.city,
        //         state: $scope.filter.state,
        //         zip: $scope.filter.zip,
        //         location: {
        //             latitude: $scope.filter.latitude,
        //             longitude: $scope.filter.longitude
        //         },
        //         distance: $scope.filter.distance,
        //         rating5: $scope.filter.snow5,
        //         rating4: $scope.filter.snow4,
        //         rating3: $scope.filter.snow3,
        //         rating2: $scope.filter.snow2,
        //         rating1: $scope.filter.snow1
        // };

        // var latitude             = req.body.location.latitude;
        // var longitude            = req.body.location.longitude;
        var location        = req.body.location; // latitude, longitude
        var distance        = req.body.distance;
        // var nickname        = req.body.nickname;
        var address         = req.body.address;
        // var tags            = req.body.tags;
        // var rating          = req.body.rating;
        var rating5         = req.body.rating5;
        var rating4         = req.body.rating4;
        var rating3         = req.body.rating3;
        var rating2         = req.body.rating2;
        var rating1         = req.body.rating1;

        var sortBy          = req.body.sortBy;
        // var created_at      = req.body.created_at;
        // var updated_at      = req.body.updated_at;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = House.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance && location){

            var latitude = location.latitude;
            var longitude = location.longitude;

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [longitude, latitude]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [longitude, latitude]},

                // Converting miles to meters. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }

        // ...include filter by Nickname
        // if(nickname){
        //     query = query.where('nickname').equals(nickname); // Regex?
        // }

        // ...include filter by Address
        // if(address){
        //     if(address.streetNumber) {
        //         query = query.where('address.streetNumber').equals(address.streetNumber); // Regex?
        //     }
        //     if(address.streetName) {
        //         query = query.where('address.streetName').equals(address.streetName); // Regex?
        //     }
        //     if(address.city) {
        //         query = query.where('address.city').equals(address.city); // Regex?
        //     }
        //     if(address.state) {
        //         query = query.where('address.state').equals(address.state); // Regex?
        //     }
        //     if(address.zip) {
        //         query = query.where('address.zip').equals(address.zip); // distance around zip?
        //     }
        // }

        // ...include filter by Tags
        // if(tags){
        //     query = query.where('tags').in(tags); // Regex
        // }

        // ...include filter by ratings
        if(rating5){
            query = query.where('avgRating').equals(5);
        }
        if(rating4){
            query = query.where('avgRating').gte(4).lt(5);
        }
        if(rating3){
            query = query.where('avgRating').gte(3).lt(4);
        }
        if(rating2){
            query = query.where('avgRating').gte(2).lt(3);
        }
        if(rating1){
            query = query.where('avgRating').gte(0).lt(2);
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, houses){
            if(err) {
                console.log(err);
                res.send(err);
            }
            console.log(houses);

            var retHouses = houses;
            if(sortBy === 2) {
                retHouses = _.sortBy(houses, ['avgRating']).reverse();
                console.log('sorted by high to low');
            } else if(sortBy === 3) {
                retHouses = _.sortBy(houses, ['avgRating']);
                console.log('sorted by low to high');
            }
            // console.log('houses',retHouses);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(retHouses);
        });
    });
};