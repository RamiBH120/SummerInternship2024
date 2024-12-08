const mongo = require("mongoose");
const Schema = mongo.Schema;

const Role = {
   
    MEMBRECNOT:'MC',
    FEDERATION:'F',
   
};


const User = new Schema({

    //firstName: String,
   // lastName:String,
   name:String,
    email:String,
    password:String,
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(Role) },
    image:{type:String , default:"public/images/userImage.png"},
   tel:Number,
    //certificate:{type:String,default:"no certificate"},
    blocked: { type: Boolean, default: false },
    resetCode: { type: String, default: ''},
    resetCodeExpiry: {type: Date,default: Date.now},
    unblockCode: { type: String, default: '' },
    twoFactorAuth: {
        secret: String,
        enabled: Boolean
      },



});

User.methods.isBlocked = function () {
    return this.blocked;
};

module.exports = mongo.model("user", User);
//module.exports = { User: mongo.model("user", User), Role };
