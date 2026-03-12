import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//suppose we are using only req and next but not res so inplace of writing (req,res,next) we can write (req, _,next) as well  

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        //in below code we are trying to get the token from the cookie or from the header and if we don't get the token. in Postman we can see or in JWT documentation we can see the token is sent in the header as (Authorization: Bearer <token>). and this is because sometimes we might not be able to access the cookie in the frontend because of some security reasons or some other reasons so in that case we can send the token in the header and we can access it from there as well. and if we don't get the token from both places then we will throw an error that the user is unauthorized.
        console.log(req.headers);
console.log(req.cookies);
        const token=req.cookies.accessToken || req.headers.authorization?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized")
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        //below (user) is the user which we will be getting from the database using the id which we will be getting from the decoded token and we will be selecting all the fields except the password and refresh token because we don't want to send those fields in the response and as we have created the method for generating access token in the user.model.js so we can directly use it here using (user) as well.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
            if (!user) {            
                throw new ApiError(401, "Invalid Access Token")
            }    
            req.user = user;
            next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})