const mongoose = require('mongoose');
const { bourseGroupes, bourseDomaines, bourseStatus } = require('../shared/enum');
const Schema = mongoose.Schema;

const Bourse = new Schema({
    nature:{
        type: String,
        required: true
    },
    montant:{
        type: Number,
        required: false
    },
    budgetPrev:{
        type: Number,
        required: false
    },
    rapportTech:
        {
        type: String,
        required: false
        },
    rapportFinan:
        {
        type: String,
        required: false
        },
    
    description:{
        type: String,
        required: false
    },
    Federation_Conserne:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    domaine:{
        type: String,
        required: true,
        enum: Object.values(bourseDomaines)
    },
    groupe:{
        type: String,
        required: true,
        enum : Object.values(bourseGroupes),
    },
    date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        default: bourseStatus.attente
    }
})

module.exports = mongoose.model("Bourse", Bourse);