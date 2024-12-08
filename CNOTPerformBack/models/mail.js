const mongoose = require('mongoose');
const { mailStatus } = require('../shared/enum');
const Schema = mongoose.Schema;

const Mail = new Schema({
    from : {
        type: String
    },
    to : {
        type : String
    },
    subject : {
        type : String
    },
    date : {
        type : Date
    },
    body : {
        type : String
    },
    unread:{
        type : Boolean,
    },
    bookmarked:{
        type: Boolean
    },
    attachements: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model('Mail', Mail);