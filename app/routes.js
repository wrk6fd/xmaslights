// Dependencies
var mongoose        = require('mongoose');
var House            = require('./model.js');
//https://www.hacksparrow.com/the-mongodb-tutorial.html
//http://mongoosejs.com/docs/2.7.x/docs/query.html
//http://mongoosejs.com/docs/queries.html


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = House.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/houses', function(req, res){

        // Creates a new House based on the Mongoose schema and the post bo.dy
        var newHouse = new House(req.body);

        // New House is saved in the db.
        newHouse.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
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
};