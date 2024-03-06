import {Request,Response} from "express"
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const register = async (req:Request,res:Response) =>{
    console.log(req.body);

    const email = req.body.email; 
    const password = req.body.password;

    if(email == null || password == null){
        return res.status(400).send("Missing Email or Password")
    }

    //check in db that such user does not exist
    try{
        const user = await User.findOne({email:email})
        if(user){
            return res.status(400).send("User already exists")
        }
        //user does not exist, encrypt his password and create new instance
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            email:email,
            password:hashedPassword
        });

        return res.status(200).send(newUser);
    }catch(error){
        console.log(error);
        return res.status(400).send(error.message);
        
    }
}

const login = async (req:Request,res:Response) =>{
    console.log("login");
    const email = req.body.email; 
    const password = req.body.password;

    if(email == null || password == null){
        return res.status(400).send("Missing Email or Password")
    }

    //User passed email and password, now identify user in db
    try{
        const user = await User.findOne({email:email});
        if(user == null){
            return res.status(400).send("Invalid Email or Password")
        }

        const isValidPassword = bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(400).send("Invalid Email or Password ")
        }

        //Generate token for user
        //TOKEN_SECRET is for the encryption of the token
        //In this case it is not RSA algorithm
        const accessToken = jwt.sign({
            _id:user.id //this is returned in the verify(if successful) in auth_middleware.ts
        },process.env.TOKEN_SECRET,
        {expiresIn: process.env.TOKEN_EXPIRATION});

        return res.status(200).send({accessToken:accessToken})
    }catch(error){
        console.log(error);
        res.status(400).send(error.message)
    }
    
    
}

const logout = (req:Request,res:Response) =>{
    res.status(400).send("logout");
}
export default {register,login,logout}