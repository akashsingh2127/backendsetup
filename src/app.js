import express from "express"
import cookieParser from "cookie-parser"//used to access user server's cookies and use it 

import cors from "cors"
const app=express()

//app.use(cors()) is also fine but for production level we also keep the options inside it
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//as a better practice we use limit for how much json we need
//we use multer for FILES because using json and body-parser we handle data and json and in new versions body-parser is by default installed
app.use(express.json({limit:"16kb"}))

// when we receive data from URL then for that we use  (express.urlencoded) because in the URL we have special characters as well so this feature is used to read URL only.
app.use(express.urlencoded({extended:true, limit:"16kb"}))//extended helps to get object inside an object otherwise even if u don't use it there won't be much difference.

//we create puclic as static to keep our images files pdfs so that if in future we need it we can use it 
app.use(express.static("public"))

app.use(cookieParser())//here too we have options but usually we don't need it 

//routes imported here

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)  //if the url finds /api/v1/users  it will redirect it to user.routes.js and there we can add as many route as we want this keeps our code clean 
export { app }