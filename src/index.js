import express from "express"
import http from "http"
import { Server } from "socket.io";
import path from "path"
const __dirname = import.meta.dirname;
import { Filter } from "bad-words"
import { generateMessageObject, generateLocationObject } from "../src/utils/messages.js"
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/Users.js";

const app = express()
const server = http.createServer(app)
const io = new Server(server);  // Create a new instance


const pathOfindexhtml = path.join(__dirname, "../public")
app.use(express.static(pathOfindexhtml))
let count = 0;
io.on('connection', (socket) => {
    console.log("new websocket connection")
    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        console.log(user)
        socket.join(user.room)

        socket.emit("message", generateMessageObject("Admin",`Welcome! ${user.username}`))
        socket.broadcast.to(user.room).emit("message", generateMessageObject('Admin',`${user.username} joined!`))
        io.to(user.room).emit("roomInfo",({room:user.room,users:getUsersInRoom(user.room)}))

    })
    // socket.emit("countupdated", count)
    // socket.on('increment', () => {
    //     count++
    //   //  socket.emit('countupdated', count)//this il emit only for 1 particlular connection
    //   io.emit('countupdated',count)
    // })
    // socket.emit("message", "Welcome!")
    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)
        if(user){
            if (filter.isProfane(message)) {
                return callback("profanity nt allowed")
            }
            io.to(user.room).emit("message", generateMessageObject(user.username,message))
            callback("message recived!")
        }
       
    })
    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessageObject(user.username,`${user.username}disconnected! from ${user.room}`))
            io.emit("roomInfo",({room:user.room,users:getUsersInRoom(user.room)}))

        }

    })
    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id)

        // io.emit("locationMessage", `https://google.com/maps?q=${location.latitude},${location.longitude}`)
        if(user){
            io.to(user.room).emit("locationMessage", generateLocationObject(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback("Location shared!")
        }
        
    })

})

server.listen(3000, () => {
    console.log("server started on 3000")
})