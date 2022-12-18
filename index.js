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
const proTemp = require('./processDB');
const {encode} = require('./encode');

dotenv.config();


const PORT = process.env.PORT || 5000

// web_change 3/4
app.use(express.static("public")); 
const path = require('path');
app.use(express.static(path.join(__dirname + "/public")));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//

app.use(express.json())
mongoose.connect(process.env.MONGO_URL_N, ()=>console.log('DB connected'));

const conn = mongoose.createConnection(
    process.env.MONGO_URL_N, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
     }
  )

const p1 = '王祐誠 醫師';
const p2 = '公用電腦';

let MessModel = conn.model('mytable', new mongoose.Schema({
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

let ProcessModel = conn.model('process', new mongoose.Schema({
    person:{
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
        
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: ["http://localhost:3000"],
        // web_change 4/4
        origin: ["https://cycle-escape2022.onrender.com"],
        methods: ["GET","POST"],
    },
});


io.on("connection",(socket)=>{
    //初始資料
    socket.on("init_set",(data)=>{
        MessModel.find({person: data.user,room: data.room}).then(async (doc) => {
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
        

            await io.to(socket.id).emit("initial_message",messList);
            console.log(messList);
        });
    });
    socket.on("get_process_data",(data)=>{
        ProcessModel.find({person:data.user}).then(async (pro) => {

            let proData = pro.pop();
            let proList = {
                person:data.user,
                login: proData.login,
                password : proData.password,
                doorlock: proData.doorlock
            }
            await io.to(socket.id).emit("process_data",proList);
        });
    })
    socket.on("set_process_data",async (data)=>{
        const processData = new proTemp({
            person: data.info.person,
            login: data.info.login,
            password : data.info.password,
            doorlock: data.info.doorlock,
        });
        await processData.save();
    })

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} join room ${data}`);           
    })  

    //傳資料&加密
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
        // socket.to(socket.id).emit("initial_message","hi");
        messData.save();
        otherMessData.save();
        
    });
    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, ()=>{//PORT
    console.log("SERVER RUNNING");
});