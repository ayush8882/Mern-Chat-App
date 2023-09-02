const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const { Socket } = require('dgram')
const app = express();
app.use(express.json())
dotenv.config();
connectDB();

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log("Listening at port 5000");
})

//socket connection
// const io = require('socket.io')(server, {
//     pingTimeout: 60000,         // Amount of time it will wait while being inactive, so as to save the bandwidth
//     cors:{
//         origin: "http://localhost:3001"
//     }
// })
// io.on("connection", (socket) => {
//     console.log("Connected to socket.io");

//     socket.on("setup", (userData) => {
//         socket.join(userData)
//         socket.emit("connected")
//     });

//     socket.on("joinChat", (room) => {
//         socket.join(room)
//     });

//     socket.on("new message", (newMessageRecieved) => {
//         let chat = newMessageRecieved.chat;
//         if(!chat.users) return;

//         chat.users.forEach(user => {
//             if(user._id == newMessageRecieved.sender._id) return;

//             socket.in(user._id).emit("message recieved", newMessageRecieved)
//         });
//     })

//     socket.off("setup", () => {
//         console.log("Socket Disconnected");
//         socket.leave(userData._id)
//     })
// })

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3001",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    
  
    socket.on("new message", (newMessageRecieved) => {
      let chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });