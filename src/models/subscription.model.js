import mongoose,{Schema} from "mongoose";

// for all subscription we will get a new document with (user) and (channel), technically both r user only but for simple to understand we r using user and channel. A channel can be subscribed by multiple users and a user can subscribe multiple channels sp we have many relationships so for calculating the number of subs for a channnel we can count the number of documents using (channel) and for calculating the number of subs a user has we can count the number of documents using (user).
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //one who is subscribing
        ref:"User",
    },
    channel:{
        type:Schema.Types.ObjectId, //one who is being subscribed to
        ref:"User",        
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)