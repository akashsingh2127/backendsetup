//we created this utility for handling the API errors like if we want it to more systematic.
//to know more about it we need to go through (nodejs API Error), and there we will find that it's in a form of Class where we can even create our own methods and we can even overwrite on basis of our ease....

class ApiError extends Error{
    constructor(statusCode,
        message="something went wrong",
        errors=[],//if we have multiple errors
        stack=""// it refers to error stack an it's work to make it easy to identify errors in a file whihc is ina form of stack
    ){
      super(message);
      this.statusCode=statusCode;
      this.data=null;// do learn about data
      this.message=message;
      this.success=false;//we r handling APIerrors not APIresponse   
      this.errors=errors;
      if(stack){
            this.stack=stack;
      }else{
        Error.captureStackTrace(this,this.constructor)
      }
    }
}

export {ApiError}