// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// // Creates a House Schema. This will be the basis of how user data is stored in the db
// var UserSchema = new Schema({
//     username: {type: String, required: true},
//     gender: {type: String, required: true},
//     age: {type: Number, required: true},
//     favlang: {type: String, required: true},
//     location: {type: [Number], required: true}, // [Long, Lat]
//     htmlverified: String,
//     created_at: {type: Date, default: Date.now},
//     updated_at: {type: Date, default: Date.now}
// });
//
// // Sets the created_at parameter equal to the current time
// UserSchema.pre('save', function(next){
//     now = new Date();
//     this.updated_at = now;
//     if(!this.created_at) {
//         this.created_at = now
//     }
//     next();
// });
//
// // Indexes this schema in 2dsphere format (critical for running proximity searches)
// UserSchema.index({location: '2dsphere'});
//
// // Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
// module.exports = mongoose.model('scotch-user', UserSchema);


var HouseSchema = new Schema({
    nickname: {type:[String], required: true},
    pictures: {type:[String], required: true},
    address: {
        street: {type: String, required: false},
        city: {type: String, required: false},
        state: {type: String, required: false},
        zip: {type: String, required: false}
    },
    location: {type: [Number], required: false}, // [Long, Lat]
    comments: {type: [String], required: false},
    ratings: {type: [Number], required: false},
    tags: {type: [String], required: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
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
