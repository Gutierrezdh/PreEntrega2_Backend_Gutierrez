const mongoose = require("mongoose");
const usercollection = "users";

const UserSchema = new mongoose.Schema({
    
    first_name: { type: String, required: true, max: 100 },
    last_name: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 100 },
    password: { type: String, required: true, max: 100 },
    age: { type: Number, required: true, max: 100 },
    role: { type: String, required: true, max: 100 },
});

const User = mongoose.model(usercollection, UserSchema);
module.exports = User
