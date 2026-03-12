import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";//JWT allows a server to prove that a request is coming from a logged-in, trusted user — without storing session data.
import bcrypt from "bcrypt";// bcrypt is used to encrypt the password

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true //if u have to make the searching part easy in database then u should use the index part.
    },
    email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {timestamps: true})

    userSchema.pre("save",async function() {// using (pre) hook will help in encrypting the password before saving
        if(!this.isModified("password")){return ;}//this is to check only if password is changed then only to encrypt 
        this.password= await bcrypt.hash(this.password,10)
        
    })  //here we need (this) reference of the user that's why we don't use the arrow function and as it's a middleware it will have the access of (next)

    userSchema.methods.isPasswordCorrect= async function(password) {//bcrypt even checks the password
        return await bcrypt.compare(password,this.password)
    }
    userSchema.methods.generateAccessToken=function(){
        return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
       
    }
    userSchema.methods.generateRefreshToken=function(){
        return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    }
export const User=mongoose.model("User",userSchema)