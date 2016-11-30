var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var HouseSchema = new Schema({
    // _id: {type: String, required: false},
    nickname: {type:[String], required: false},
    pictures: {type:[String], required: false},
    address: {
        street: {type: String, required: false},
        city: {type: String, required: false},
        state: {type: String, required: false},
        zip: {type: String, required: false}
    },
    location: {type: [Number], required: false}, // [Long, Lat]
    comments: [{
        id: {type: Number, required: false},
        text: {type: [String], required: false},
        user: {type: [String], required: false},
        time: {type: Date, default: new Date()}
    }],
    ratings: {type: [Number], required: false},
    avgRating: {type: Number, required: false},
    tags: {type: [String], required: false},
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()}
});

// Sets the created_at parameter equal to the current time
HouseSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
HouseSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports = mongoose.model('House', HouseSchema);
