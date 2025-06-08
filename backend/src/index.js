import express from'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from './lib/db.js'
import { app,server } from './lib/socket.js'

import path from 'path'

dotenv.config()

const PORT=process.env.PORT
const __dirname=path.resolve()

app.use(express.json({limit:'10mb'})) // used to extract json data
//when importing a large file like images, we need to use the limit to avoid large payload error
//the usual limit of express.json() is 100kb or 1 mb(depending on version)
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))


    app.get(/(.*)/,(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

server.listen(PORT,()=>{
    console.log(`Server is running on port:${PORT}`)
    connectDB()
})