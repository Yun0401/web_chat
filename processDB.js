const mongoose = require('mongoose');

const proTemp = new mongoose.Schema({
    person: {
        type:String,
        required:true
    },
    login: {
        type:Boolean,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    doorlock: {
        type:Boolean,
        required:true
    }   
})


module.exports = mongoose.model('process',proTemp);