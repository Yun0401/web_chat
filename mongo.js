const mongoose = require('mongoose');

const messTemp = new mongoose.Schema({
    person: {
        type:String,
        required:true
    },
    room: {
        type:String,
        required:true
    },
    author: {
        type:String,
        required:true
    },
    message :{
        type:String,
        required:true
    },         
    time: {
        type:String,
        required:true
    }     
})

module.exports = mongoose.model('mytable',messTemp);