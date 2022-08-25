//加密方法 初始化 密碼 連線問題
//test3版本暫時有了，繼續會更好
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io")
app.use(cors());
const dotenv = require('dotenv');

const messTemp = require('./mongo');
const {encode} = require('./encode');

dotenv.config();

// app.use(express.static("public")); 
// const path = require('path');
// const PORT = process.env.PORT || 3001
//3000
// app.use(express.static(path.join(__dirname + "/public")));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.use(express.json())
mongoose.connect(process.env.MONGO_URL_N, ()=>console.log('DB connected'));
// mongoose.connection.on('open',()=>{
//     process.env.connect_database = 1;
//     console.log('DB connect success');
// });
// mongoose.connection.on('error',()=>{
//     process.env.connect_database = 0;
//     console.log('DB connect failed');
// });
const conn = mongoose.createConnection(
    process.env.MONGO_URL_N, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
     }
  )

const p1 = 'doctor';
const p2 = '公用電腦';

let Model = conn.model('mytable', new mongoose.Schema({
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
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        // origin: ["https://letschatting0616.herokuapp.com"],
        methods: ["GET","POST"],
    },
});


io.on("connection",(socket)=>{
    //初始資料
    socket.on("init_set",(username)=>{
        Model.find({person: username}).then(async (doc) => {
            let messList = [];
            doc.map((messData)=>{
                let new_Data = {
                    room: messData.room,
                    author: messData.author,
                    message: messData.message,
                    time: messData.time
                };
                messList = [...messList,new_Data];
            });
            // app.post('/sixpin00', function (req, res) {
            //     res.send("hi");
            //     console.log('hihi');
            // });
            await io.to(socket.id).emit("initial_message",messList);
            console.log(messList);
        });
    });
    
    // console.log(`User Connected: ${socket.id}`);
    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} join room ${data}`);           
    })
    
    // socket.on("init_page",()=>{
        // Model.find({person: 'doctor'}).then(async (doc) => {
        //     let messList = [];
        //     doc.map((messData)=>{
        //         let new_Data = {
        //             room: messData.room,
        //             author: messData.author,
        //             message: messData.message,
        //             time: messData.time
        //         };
        //         messList = [...messList,new_Data];
        //     });
        //     // app.post('/sixpin00', function (req, res) {
        //     //     res.send("hi");
        //     //     console.log('hihi');
        //     // });
        //     await io.to(socket.id).emit("initial_message",messList);
        //     console.log(messList);
        // });
    // })
    

    socket.on("send_message", (data) => {
        
        const newData = encode(data.message,data.author)
        const newMess = {
            room: data.room,
            author: data.author,
            message: newData,
            time: data.time
        }
        const messData = new messTemp({
            person:data.author === p1 ? p1:p2,
            room: data.room,
            author: data.author,
            message: data.message,
            time: data.time
        })
        const otherMessData = new messTemp({
            person: data.author === p2 ? p1:p2,
            room: data.room,
            author: data.author,
            message: newData,
            time: data.time
        })
        socket.to(data.room).emit("receive_message",newMess);
        socket.to(socket.id).emit("initial_message","hi");
        messData.save();
        otherMessData.save();
        
    });
    socket.on("disconnect",()=>{
        // console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, ()=>{//PORT
    console.log("SERVER RUNNING");
});