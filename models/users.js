const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now()
    },
    userName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    companyName : {
        type : String
    },
    address : {
        type : String
    },
    city : {
        type : String
    },
    state : {
        type : String
    },
    postalCode : {
        type : String
    },
    password : {
        type : String
    },
    role: {
        type: String
    }, 
});



module.exports = users = mongoose.model('user', UsersSchema);
