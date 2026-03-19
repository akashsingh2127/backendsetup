# this is all about how u setup backend. here we will talk about all the repositories and files we need to create which is even important for the production level 
# we create public folder ->temp folder ->.gitkeep file
# .gitkeep exists so Git can track empty folders during project setup.
# .gitignore is created for safety purpose and usually we copy these gitignore code from any of the online gitignore generator for NODE
# then create .env -> .env.sample ->src folder
# we install nodemon for nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected
# install nodemon then make changes in package.json for nodemon.
# make respective folders inside src
# then we install Prettier for Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

# till here it was all about setup



# For user.controller.js
//1. registerUser controller is used to register a new user in the database and it accepts the user details from the req.body and also accepts the avatar and cover image files from the req.files and uploads them to cloudinary and then creates a new user in the database with the provided details and returns the created user in the response after removing the password and refresh token fields from it.
//2. loginUser controller is used to login a user and it accepts the username or email and password from the req.body and checks for the validity of the credentials and if valid then it generates access token and refresh token for that user and sends them in the response along with the logged in user details after removing the password and refresh token fields from it.
//3. logoutUser controller is used to logout a user and it removes the refresh token from the database for that user and also clears the access token and refresh token cookies from the frontend.
//4. refreshAccessToken controller is used to refresh the access token for a user and it accepts the refresh token from the cookie and verifies it and if valid then it generates new access token and refresh token for that user and saves the new refresh token in the database and sends the new access token and refresh token in the response.
//5. changePassword controller is used to change the password of a user and it accepts the old password and new password from the req.body and checks for the validity of the old password and if valid then it updates the password with the new password in the database.
//6. getCurrentUser controller is used to get the details of the currently logged in user and it directly returns the user details which are attached in the req.user by the auth middleware.
//7. updateAccountDetails controller is used to update the account details of a user such as full name and email and it accepts the new full name and email from the req.body and updates them in the database.
//8. updateUserAvatar controller is used to update the avatar of a user and it accepts the new avatar file from the req.file and uploads it to cloudinary and then updates the avatar url in the database.
//9. updateUserCoverImage controller is used to update the cover image of a user and it accepts the new cover image file from the req.file and uploads it to cloudinary and then updates the cover image url in the database.
//10. getUserChannelProfile controller is used to get the channel profile of a user and it accepts the username of the user from the req.params and finds the user in the database and also gets the count of subscribers and channels subscribed to as well as checks whether the logged in user is subscribed to that channel or not and returns all these details in the response.
//11. getWatchHistory controller is used to get the watch history of a user and it accepts the user id from the req.user and finds the user in the database and also gets the details of the videos in the watch history along with the owner details of those videos using nested pipelining in the aggregate function and returns all these details in the response. 