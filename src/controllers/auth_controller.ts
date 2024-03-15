import {NextFunction, Request,Response} from "express"
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

        const refreshToken = jwt.sign({
            _id:user.id //this is returned in the verify(if successful) in auth_middleware.ts
        },process.env.REFRESH_TOKEN_SECRET);

        if(user.tokens == null){
            user.tokens = [refreshToken]
        }
        else{
            user.tokens.push(refreshToken);
        }
        //save user document in db(update it)
        await user.save();

        return res.status(200).send({
            accessToken:accessToken,
            refreshToken:refreshToken
        });
    }catch(error){
        console.log(error);
        res.status(400).send(error.message)
    }
    
    
}

const logout = (req:Request,res:Response) =>{
    res.status(400).send("logout");
}

const refresh = async(req:Request,res:Response) =>{
    //First extract token from HTTP header request
    const authHeader = req.headers['authorization']; // authorization Header =  bearer(TOKEN TYPE)+ " " + token
    const refreshToken = authHeader && authHeader.split(' ')[1];    
    if(refreshToken == null){
        return res.status(401).send("Missing Token");
    }

    //verify token
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,async(err,userInfo:{_id:string})=>{
        if(err){
            return res.status(403).send("Invalid Token");
        }

        try{
            const user = await User.findById(userInfo._id);
            if(user == null || user.tokens == null || !user.tokens.includes(refreshToken)){
                if(user.tokens != null){
                    user.tokens = []; //delete all refresh tokens of user, now no one can create new access token for that user
                    await user.save();
                }
                return res.status(403).send("Invalid Token");
            }
    
            //generate new access token
            const accessToken = jwt.sign({
                _id:user.id //this is returned in the verify(if successful) in auth_middleware.ts
            },process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRATION});
    
            //generate new refresh token
            const newRefreshToken = jwt.sign({
                _id:user.id //this is returned in the verify(if successful) in auth_middleware.ts
            },process.env.REFRESH_TOKEN_SECRET);
    
            //delete old refresh token and update new refresh token in db
            user.tokens = user.tokens.filter(token => token!=refreshToken)
            user.tokens.push(newRefreshToken);
            await user.save();
            //return new access token & new refresh token
            return res.status(200).send({
                accessToken:accessToken,
                refreshToken:newRefreshToken
            });
        }catch(error){
            console.log(error);
            res.status(400).send(error.message);
        }
        
    }); 
    
}
export default {register,login,logout,refresh}