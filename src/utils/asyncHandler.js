//in it we created higher order function (a function which takes another function as a parameter)
//the actual syntax of express is (error,req,res,next) but in below exapmle we didn't take error because we will use try catch and the error will be handled by the catch part by its own
// const asyncHandler=(func)=>async (req,res,next)=> {
//     try {
//         await func(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({//this will be shown on the frontend for the users ease
//             success: false,
//             message: error.message
//         })
//     }
// }

// export {asyncHandler}



//the above way was using try catch now we will do the same coding using promises
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=> next(error)
        )
    }
}

export {asyncHandler}

//we created thsi asyncHandler function to handle the errors in a better way and to avoid writing try catch block in every controller function and to make our code cleaner and more readable and to handle the errors in a centralized way. and ApiError is a custom error class which we have created to handle the errors in a better way and to return the errors in a consistent format and to avoid writing the same code for handling the errors in every controller function. and APIresponse is a custom response class which we have created to return the responses in a consistent format and to avoid writing the same code for returning the responses in every controller function.