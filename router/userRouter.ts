import express from "express";
import {body,validationResult} from 'express-validator';
import {IUser} from "../models/IUser";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import TokenVerifier from "../middlewares/TokenVerifier";
const userRouter:express.Router = express.Router();
// logic
/*
1. Register a User
 USAGE  : Register a User
 URL    : http://127.0.0.1:5000/user/register
 Method : POST
 Fields : name,email,password
 Access  : PUBLIC
 */
userRouter.post('/register',[
   body('name').not().isEmpty().withMessage('Name is Required'),
   body('email').not().isEmpty().withMessage('Email is Required'),
   body('password').not().isEmpty().withMessage('Password is Required'),
],async (request:express.Request , response:express.Response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({
            errors : errors.array()
        })
    }
    try{
        let { name , email , password } = request.body;
        // check if the email is exist are not
let user:IUser | null = await User.findOne({email : email});
if(user){
    return response.status(400).json({
        errors : [
            {msg : 'User is Already Exist'}
        ]
    });
}
        // encrypt the password
let salt = await bcrypt.genSalt(10);
password = await bcrypt.hash(password , salt);
        //get avatar url
        let avatar = gravatar.url(email,{
            s:'300',
            r:'pg',
            d:'mm'
        });
        //register the user
        user = new User({name,email,password,avatar});
        user = await user.save();

        response.status(200).json({
            msg:'Registration is Success'
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});


/*
2 . Login a User
 USAGE  : Login a User
 URL    : http://127.0.0.1:5000/user/login
 Method : POST
 Fields : email,password
 Access  : PUBLIC
 */
userRouter.post('/login',[
    body('email').not().isEmpty().withMessage('Email is Required'),
    body('password').not().isEmpty().withMessage('Password is Required')
],async (request:express.Request , response:express.Response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({
            errors : errors.array()
        });
    }
    try{
        let {email,password} = request.body;

        //Check for Email
        let user:IUser | null = await User.findOne({email : email});
        if(!user){
            return response.status(401).json({
                errors : [
                    {msg : 'Email is invalid'}
                ]
            });
        }

        //Check for Password

        let isMatch:boolean = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return response.status(401).json({
                errors : [
                    {msg : 'User is Already Exist'}
                ]
            });
        }

        //Create a token
        let payload:any = {
            user:{
                id:user.id,
                name:user.name
            }
        };
        let secretKey : string | undefined = process.env.JWT_SECRET_KEY;
if (secretKey){
  let token = await jwt.sign(payload ,secretKey)
    response.status(200).json({
        msg:'login of Success',
        token:token
    });
}
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});



/*
3.USAGE  : GET USER INFO
 URL    : http://127.0.0.1:5000/user/me
 Method : GET
 Fields : no-fields
 Access  : PRIVATE
 */
userRouter.get('/me',TokenVerifier,async (request:express.Request,response:express.Response) => {
    try{
        //TODO GET USER INFO LOGIC
        let requestedUser:any=request.headers['user'];
        /*let user:IUser | null = await User.findOne({_id:requestedUser.id});*/
        let user:IUser | null = await User.findById(requestedUser.id).select('-password');
        if (!user){
            return response.status(400).json({
                errors:[
                    {
                        msg:"user data not found"
                    }
                ]
            });
        }
        response.status(200).json({
            user:user
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            errors:[
                {
                    msg:error
                }
            ]
        })
    }
});
export default userRouter;



