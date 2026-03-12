class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode<400

        //below r some chracterization of statuscode
        /*Informational responses (100 – 199)
        Successful responses (200 – 299)
        Client error responses (400 – 499)
        Redirection messages (300 – 399)
        Server error responses (500 – 599)
        */
    }
}

export {ApiResponse}