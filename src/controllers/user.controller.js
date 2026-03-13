import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; // hence we created User directly using mongoose model so we can directly import it here and use it to create user in the database and it can access all the content from the database and as well the methods we created in the user.model.js
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessandRefreshTokens= async(userId)=>{
    try {
         const user = await User.findById(userId)
         //this is to create AccessToken and RefreshToken
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
 
        // we will be saving the refresh token in the database because we will be using it to verify the user when they will send the refresh token to get the new access token and also to invalidate the refresh token when user will logout and as we have created the method for generating refresh token in the user.model.js so we can directly use it here using (user) and as we have created the method for generating access token in the user.model.js so we can directly use it here using (user) as well.

        user.refreshToken = refreshToken
        //we need to save this change in the database so we use user.save() command. and as we can see in the RefreshToken part in user.model it also want the password field to be there but we don't want to change the password field so we will use (validateBeforeSave: false) in the save command which will help us to save the refreshToken without validating the password field and it will not throw any error for that.
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("TOKEN ERROR:", error)
        throw new ApiError(500, "Something went wrong while generating referesh and access token")        
    }

}

const registerUser=asyncHandler(async(req,res,next)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar.......  u need to use multer as middleware in user.routes.js
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    const {fullName,username,email,password}= req.body;
    // if we want we can write if command for all the fields but if we want to write it in a better way then we can use (some) method of array which will check for all the fields and if any one of them is empty then it will return true and we can handle that error in a better way.
    if ([fullName,username,email,password].some( 
        (fields)=>fields?.trim()===""))  
    {
        throw new ApiError(400,"All fields are required")
    }
    // now to check email format is correct eg @ is present in it or not we can use regex for that and we can also check for password strength using regex as well but for now we will keep it simple and just check for @ in email.
    if(!email.includes("@")){
        throw new ApiError(400,"Invalid email format")
    }

    // below line is to check if there exists an user wit these credentials or not if user exists then we will throw an Api error
    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    // to check if the avatarLocalPath exists or not
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    // to upload this localpath insisde the cloudinary that's why insisde the cloudinary.js we r accepting LocalFilePath
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    // now u need to check for avatar if it has been successfully sent to cloudinary
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    // as we haven't checked whether our coverImageLocalPath exists or not neither for it's wploading part on cloudinary so we can handle it in the Database itself while creating the object because it's not compulsory like avatar
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()

    })
    //to remove password and refreshToken   and by default everything is selected in (.select()) in mongoose that's why we follow this syntax
    const cretaedUser= await User.findById(user._id).select("-password -refreshToken")
    if(!cretaedUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // below is the code to return the response and we r returning the response in the same format as we have defined it in the ApiResponse
    return res.status(201).json(
        new ApiResponse(200,cretaedUser,"User registered successfully")
    )


})
const loginUser=asyncHandler(async(req,res,next)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {username,email,password}=req.body
    // to login using either of the credentials
    if (!email && !username) {
        throw new ApiError(400,"Email and username is required")
        
    }
    const user= await User.findOne({$or:[{username},{email}]})
    if(!user){
        throw new ApiError(404,"User doesn't exist")
    }
    //below we won't be using (User) instead we will be using (user) because we know User has the direct access with the database so we can access the mongoDB function using User, but for using our own created methods we need to do it using user.
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }
    const {accessToken, refreshToken}= await generateAccessandRefreshTokens(user._id)
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")
    //below line is to send the cookie in the response and we will be sending the refresh token in the cookie because we want to keep the access token in the memory of the frontend and as we have defined the options for the cookie in the utils folder so we can directly use it here. and httpOnly is true because we don't want to access the cookie from the frontend and secure is true because we want to send the cookie only in the https and as we are in development phase so we will be using (secure: false) for now but in production we will change it to (secure: true) because in production we will be using https.
    const options={httpOnly:true, secure:false}

    // we installed cookie parser in the backend and we will be using it to send the cookie in the response.
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200,{user:loggedInUser, accessToken,refreshToken},"User logged in successfully")
    ) 


})
const logoutUser=asyncHandler(async(req,res,next)=>{
    // get user id from req.user
    // find the user in the database
    // remove the refresh token from the database
    // clear cookie from frontend
    // send response
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined 
            // in short we are just removing the refresh token from the database by setting it to undefined and as we have set the expiry time for the refresh token in the (env) so it will automatically expire after that time and even if we don't set it to undefined it will expire after that time but it's a good practice to remove it from the database as well when user logs out. and as we are not sending any response for that so we can ignore it as well.
        }},
        {
            new:true //this is to returnu the updated refresh token in the response but as we are not sending any response for that so we can ignore it as well
        }
    )

    const options={httpOnly:true, secure:true}

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
       new ApiResponse(200,{},"User logged out successfully")
    )

})

const refreshAccessToken=asyncHandler(async(req,res,next)=>{
    // get refresh token from cookie
    // verify the refresh token
    // if valid then generate new access token and refresh token
    // save the new refresh token in the database
    // send the new access token and refresh token in the response
   try {
     const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
     if(!incomingRefreshToken){
         throw new ApiError(401,"Unauthorized request, refresh token is missing")
     }
     const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET) 
     const user= await User.findById(decodedToken?._id)
     if(!user){
         throw new ApiError(401,"Unauthorized request, invalid refresh token")
     }
     if(incomingRefreshToken!==user.refreshToken){
         throw new ApiError(401,"Unauthorized request, invalid refresh token")
     }
     
     const options={httpOnly:true, secure:false}
     const {accessToken, newrefreshToken}= await generateAccessandRefreshTokens(user._id)
 
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(
         new ApiResponse(200,{accessToken, refreshToken:newrefreshToken},"Access token refreshed successfully")
     )
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
    
   }

})

const changePassword=asyncHandler(async(req,res,next)=>{
    // get user id from req.user
    // get old password and new password from req.body
    // find the user in the database
    // check if old password is correct
    // if correct then update the password with the new password
    // send response
    const {oldPassword, newPassword}= req.body
    //we need the user and we also have the user id available in the req.user because we have the auth middleware which will verify the access token and will attach the user id in the req.user so we can directly use it here to find the user in the database

    const user= await User.findById(req.user?._id)

    //isPasswordCorrect is the method which we created in the user.model.js for verification and i treturns either true or false value so direclty in if else we can check for that and as we have created this method using userSchema.methods so we can directly use it here using (user) and as we are passing the old password in the req.body so we can directly use it here as well.
    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Old password is incorrect")
    }
    user.password=newPassword
    await user.save({validateBeforeSave: false}) // as we have created the pre hook for encrypting the password before saving the user in the database so we need to use (validateBeforeSave: false) here as well to avoid the error of password is required because we are not providing the password in the req.body while changing the password but we are providing it in the user object so it will be encrypted before saving in the database and it will not throw any error for that.
    return res.status(200).json(
        new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser=asyncHandler(async(req,res,next)=>{
    //directly we returning the user which we have attached in the req.user in the auth middleware because we have already fetched the user from the database in the auth middleware and we have attached it in the req.user so we can directly return it here 
    return res.status(200).json(
        200,req.user,"Current user fetched successfully") 

})

const updateAccountDetails=asyncHandler(async(req,res,next)=>{
    //for this we need two middleware multer for accepting files and other to give access to the user who r logged in 
    //for updating any file we should keep seperate controllers or endpoint for it -production based advise
    const {fullName,email}=req.body
    if(!fullName && !email){
        throw new ApiError(400,"All fields r required to update")
    }
    //{new:true} is to return the updated user in the response and as we have created the method for generating access token in the user.model.js so we can directly use it here using (user) as well.
    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{fullName,email:email}
    },{new:true}).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,user,"User details updated successfully")
)})

const updateUserAvatar=asyncHandler(async(req,res,next)=>{
    const avatarLocalPath = req.file?.path;//here we took file not files as used for loginUser because there we needed avatarfile as well as coverImage but here we just need avatarFile\
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"Something went wrong while uploading the avatar")
    }
   const user= await User.findByIdAndUpdate(req.user._id,{
        $set:{avatar:avatar.url}
    },{new:true}).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,user,"User avatar updated successfully")
     )
})
const updateUserCoverImage=asyncHandler(async(req,res,next)=>{//exactly same logic as updateUserAvatar
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image file is required")
    }
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400,"Something went wrong while uploading the cover image")
    }
    const user= await User.findByIdAndUpdate(req.user._id,{
        $set:{coverImage:coverImage.url}
    },{new:true}).select("-password -refreshToken")
    return res.status(200).json(
        new ApiResponse(200,user,"User cover image updated successfully")
     )
})


export {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage}