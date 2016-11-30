var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    address: {
        street: {type: String, required: false},
        city: {type: String, required: false},
        state: {type: String, required: false},
        zip: {type: String, required: false}
    },
    location: {type: [Number], required: false} // [Long, Lat]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);