import {Router} from "express"
import { logoutUser,loginUser,registerUser,refreshAccessToken,changePassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

// we need to use multer as middleware in betwwen ot handle the files we receive. and we use fields instead of single or array because we have two files to receive and they have different names so we can use fields and inside it we can specify the name of the file and the max count of files we want to receive for that field. and as we are receiving files we need to use form-data in postman to test it. and in the frontend we need to use form-data as well to send the data.
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)


router.route("/logout").post(verifyJWT,logoutUser) 

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)//if we use post method it will create a new resource and will update all the details but if we use patch method it will update only the details we want to update and will not create a new resource. so we use patch method here.

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

//in getUserChannelProfile we r fetching username from params so we need to use (/c/:username) as the route and we need to use get method to fetch the data and we need to use verifyJWT middleware to protect this route because we want only authenticated users to access this route and we need to use getUserChannelProfile controller to handle the logic of fetching the user channel profile. and in the frontend we can use this route to fetch the user channel profile by passing the username in the url. for example if we want to fetch the channel profile of user with username "john" we can make a get request to /c/john and it will return the channel profile of user "john".
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)
export default router 