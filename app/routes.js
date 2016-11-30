// Dependencies
var mongoose        = require('mongoose');
var House            = require('./house');
var User            = require('./user');
var passport        = require('passport');
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

        // Uses Mongoose schema to run the search (empty conditions)
        var query = House.find({});
        console.log('connecting to mongodb');
        query.exec(function(err, houses){
            console.log('still connecting...');
            if(err) {
                console.log(err);
                res.send(err);
            }
            console.log(houses);
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
        console.log(newHouse);

        // New House is saved in the db.
        newHouse.save(function(err,house){
            if(err) {
                console.log(err);
                res.send(err);
            }

            // If no errors are found, it responds with a JSON of the new user
            console.log('new house',house);
            res.json(house);
        });
    });

    app.put('/houses', function(req, res){
        var updatedHouse = new House(req.body),
            house_id = updatedHouse._id;

        var obj = updatedHouse.toObject();
        delete updatedHouse._id;

        // console.log(obj);
        // console.log(house_id);

        var query = House.update(house_id, obj, function(err, house) {
            if(err)
                res.send(err);

            console.log(house);
            res.json(house);
        })
    });

    app.put('/rate', function(req, res) {

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
        if (!req.isAuthenticated()) {
            console.log(req);
            return res.status(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true
        });
    });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var nickname        = req.body.nickname;
        var address         = req.body.address;
        var tags            = req.body.tags;
        var rating          = req.body.rating;
        var created_at      = req.body.created_at;
        var updated_at      = req.body.updated_at;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = House.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance && (lat && long)){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }

        // ...include filter by Nickname
        if(nickname){
            query = query.where('nickname').equals(nickname); // Regex?
        }

        // ...include filter by Address
        if(address){
            if(address.street) {
                query = query.where('address.street').equals(address.street); // Regex?
            }
            if(address.city) {
                query = query.where('address.city').equals(address.city); // Regex?
            }
            if(address.state) {
                query = query.where('address.state').equals(address.state); // Regex?
            }
            if(address.zip) {
                query = query.where('address.zip').equals(address.zip); // distance around zip?
            }
        }

        // ...include filter by Tags
        if(tags){
            query = query.where('tags').in(tags); // Regex
        }

        // ...include filter by ratings
        if(rating){
            query = query.where('comments.ratings').equals(rating);
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(users);
        });
    });

    app.post('/picUpload')
};