import express from "express";
import jwt from 'jsonwebtoken';
let TokenVerifier = async (request:express.Request , response:express.Response , next:express.NextFunction) => {
    try {
        let token = request.headers['x-auth-token'];
        if (!token){
            return response.status(401).json({
                errors:[
                    {
                        msg:'No Token Provided . Access Denied'
                    }
                ]
            });
        }

           if (typeof token === "string"){
               let decode:any = await jwt.verify(token,process.env.JWT_SECRET_KEY);
               request.headers['user'] = decode.user;
               next();
           }

    }
    catch (error) {
return response.status(500).json({
    error:[
        {
            msg:'Invalid Token Provided . Access Denied'
        }
    ]
})
    }
};

export default TokenVerifier;