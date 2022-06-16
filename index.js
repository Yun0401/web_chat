//加密方法 初始化 密碼 連線問題

const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io")
app.use(cors());

app.use(express.static("public")); 
const path = require('path');
const PORT = process.env.PORT || 3000
app.use(express.static(path.join(__dirname + "/public")));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://letschatting0616.herokuapp.com"],
        methods: ["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} join room ${data}`);
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message",data);
        
    });
    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, ()=>{
    console.log("SERVER RUNNING");
});