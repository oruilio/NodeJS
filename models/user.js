var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); //add in username and hashed storage of password using hash and salt
                                    //also add passport method to user schema
module.exports = mongoose.model('User', User);