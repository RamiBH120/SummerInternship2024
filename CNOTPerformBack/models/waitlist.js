const mongo = require("mongoose");
const Schema = mongo.Schema;

const Role = {
    
    ADMIN:'A',
    MEMBRECNOT:'MC',
    FEDERATION:'F',
   
  
};


const Waitlist = new Schema({


   
    firstName: String,
    lastName:String,
    email:String,
    password:String,
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(Role) },
    image:{type:String , default:"../../public/images/image.png"},
    address:String,
    federation:String,
    certificate:String,
    status: { type: Boolean, default: false }
    
   
  
});
module.exports = mongo.model("waitlist", Waitlist);
