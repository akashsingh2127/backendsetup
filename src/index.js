//require ('dotenv').config();// dotenv claims at the beginning of the main file always u have to write so that env variables will available to every file as they get loaded but it doesn't maintain the consistency so we write it in module way.

//for using the module way for dotenv we need to make changes in the script-> dev -r dotenv/config --experimental-json-modules in package.json 
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({path:'./.env'})

//we have written an asynchronous method in db so it returns a promise here
connectDB().then(
    ()=>{
        app.on("Error",(error)=>{
            console.log("ERROR",error);
            throw error;
        })
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running at Port: ${process.env.PORT }`);
            
        })
    }
).catch((error)=>{
    console.log("MONGO DB Connection Failed",error)
});
















//one way of linking backend with the database where u write the entire thing in the index page itself, but writing the code seperately in other file and importing that in index.js makes the code look clean and good.
/*
import express from "express"

const app=express();

//it's a good practice to have semi colons before u start writing this kind of functions
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error",(error)=>{
            console.log("ERROR",error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is running at${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR:",error);
        
    }
})()

*/