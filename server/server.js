const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const cors = require('cors')
const db =  require('./config/db')
const cookieParser = require('cookie-parser')
const path = require('path')
const expImg = require("express-fileupload")
const socketIo = require('socket.io')

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
// app.use(express.urlencoded({extended: true}))


app.use(
    expImg({
      useTempFiles: true,
    })
  );


app.use('/user', require('./routes/userRoute'))
app.use('/message', require('./routes/messageRoute'))
app.use('/chat', require('./routes/chatRoute'))
app.use('/status', require('./routes/statusRoute'))
app.use('/img', require('./routes/imgRoute'))
app.use('/sendmail', require('./routes/mailRoute'))
const _dirname1 = path.resolve()


app.get('/', (req, res)=>{
    console.log('dev')
    
    res.send('API is running sucessfully oo')
})



const PORT = process.env.PORT || 5000
const server = app.listen(PORT, ()=>{
    db()
})


const sock = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
})

sock.on('connection', (socket)=>{
    socket.on('setup', (userData)=>{
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join room', (chatId)=>{
        socket.join(chatId)
    })

    socket.on('new message', (newMessage)=>{
        const users = newMessage.chat.users
        if(!users) return console.log('no user in chat')
        users.forEach(user=>{
            if(user._id==newMessage.sender._id){
            }else{
                socket.in(user._id).emit('receive message', newMessage)
            }
        })
    })

    socket.on('videocall', (info)=>{
        socket.in(info.chatId).emit('videocall', info)
    })


    socket.on('typing', (chatId)=>{
        socket.in(chatId).emit('typing')
    })

    socket.on('stop typing', (chatId)=>{
        socket.in(chatId).emit('stop typing')
    })
    socket.on("send friend request", (data)=>{
        socket.in(data.chatId).emit('notify friend request', data)
    });

})

