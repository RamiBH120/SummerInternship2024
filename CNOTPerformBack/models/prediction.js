const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Prediction = new Schema({
    identifiantcnot:{
        type: String,
        unique: true
    },
    fullname:{
        type: String,
    },
    cin:{
        type:Number
    },
    predictionhistory:[
        {
            predictionname:{
                type: String,
            },
            values:[
                {
                feature:{
                    type: String
                },
                value:{
                    type: mongoose.Schema.Types.Mixed
                }
            }
            ],
            result:{
                type:Boolean
            },
            predictionDate:{
                type: Date,
                default: Date.now
            }
        }
    ]

})

module.exports = mongoose.model("Prediction", Prediction);