import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//process.exit(n) is a new concept 
const connectDB= async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected!! DB Host: ${connectionInstance.connection.host}`)
        // it does the same work as listen used to do in the direct code we have written inside the inde.js
    } catch (error) {
        console.log("ERROR is : ",error);
        process.exit(1);
    }
}

export default connectDB;