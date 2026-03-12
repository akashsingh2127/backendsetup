import {Router} from "express"
import { logoutUser,loginUser,registerUser,refreshAccessToken } from "../controllers/user.controller.js";
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
export default router 