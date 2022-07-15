const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const cors = require('cors')
const db =  require('./config/db')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
const socketIo = require('socket.io')

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())



const imageStorage = multer.diskStorage({
    destination: 'images',
    filename: (req, file,cb)=>{
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb){
        if(!file) return res.status(400).json('Please choose an image')
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/i)){
            return cb(new Error('Please Upload an image'))
        }
        cb(null, true)
    }
})

//router here
app.use('/images', express.static('images'));

app.post('/imageupload', imageUpload.single('image'), (req, res)=>{
    try {
        return res.status(200).json(req.file.filename)
    } catch (error) {
        return res.status(400).json(error)
    }
})
app.use('/user', require('./routes/userRoute'))
app.use('/message', require('./routes/messageRoute'))
app.use('/chat', require('./routes/chatRoute'))
const _dirname1 = path.resolve()


app.get('/', (req, res)=>{
    console.log('dev')
    
    res.send('API is running sucessfully oo')
})

// if(process.env.NODE_ENV==='production'){
//     app.use(express.static(path.join(_dirname1, '/client/build')));
    
//     app.get('*', (req, res)=>{
//         res.sendFile(path.resolve(_dirname1, 'client', 'build', 'index.html'))
//     })
// }


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
            if(user==newMessage.sender._id){
                return
            }else{
                socket.in(user).emit('receive message', newMessage)
            }
        })
    })
    socket.on('typing', (chatId)=>{
        socket.in(chatId).emit('typing')
    })
    socket.on('stop typing', (chatId)=>{
        socket.in(chatId).emit('stop typing')
    })

})

