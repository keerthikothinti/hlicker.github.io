const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    gender: String,
    phone: Number,
    bio: String,
    image: String,
}) ;


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);