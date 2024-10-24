const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 5000

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
/*app.use(): This is an Express middleware function*/
/*express.static(): This is a built-in middleware function in Express.*/
const users = {};

io.on('connection',(socket)=>{
    // if any new user joins, let other users connected to the server know!
   // console.log("A new user just connected");
    socket.on('new-user-joined', sname =>{
        console.log("A new user just connected",sname);
        users[socket.id]= sname;
        socket.broadcast.emit('user-joined',sname);

    });
    // if someone sends a message, broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message: message,sname:users[socket.id]})
    });
    // if someone leaves the chat, let others know 
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})




