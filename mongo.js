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

// const proTemp = new mongoose.Schema({
//     login: {
//         type:Boolean,
//         required:true
//     },
//     password: {
//         type:String,
//         required:true
//     },
//     doorlock: {
//         type:String,
//         required:true
//     }   
// })


module.exports = mongoose.model('mytable',messTemp);
// module.exports = mongoose.model('process',proTemp);