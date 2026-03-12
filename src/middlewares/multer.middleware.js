//multer is a middleware for handling multipart/form-data, which is primarily used for uploading files. It makes it easy to handle file uploads in Node.js applications. In this code snippet, we are configuring multer to store uploaded files on the disk in a specific directory and with their original names.
import multer from "multer";
const storage = multer.diskStorage({//we got it from the documentation
    destination: function (req, file, cb) {
      cb(null, "./public/temp")//folder name where we want to save the file 
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)// we want to save the file with the original name, but if u read the documentation they will add a few numbers at the end of the file to overcome overwriting. but here we will have the file for a short period of time then we will send it to the coudinary so no need to to do it now.
    }
  })
  
export const upload = multer({ 
    storage, 
})