const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true }
}, { versionKey: false }); // to remove "__v" in db

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);