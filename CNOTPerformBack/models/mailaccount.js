const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Mailaccount = new Schema({
    mailaddress : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Mailaccount', Mailaccount);