import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken"
const authMiddleware = async(req:Request,res:Response,next: NextFunction) =>{
    console.log("auth middleware");
    //extract token from http header and check if it is valid
    //if the token is valid, it means the user logged-in-->call next()
    //from the token we can retrieve the user id as we declared in jwt.sign()
    const authHeader = req.headers['authorization']; // authorization Header =  bearer(TOKEN TYPE)+ " " + token
    const token = authHeader && authHeader.split(' ')[1]; 
       
    if(token == null){
        return res.status(401).send("Missing Token");
    }

    //token received, now verify it
    jwt.verify(token,process.env.TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.status(403).send("Invalid Token");
        }
        req.body.user = user //Keep user's data for using it in the express pipeline
        
        next();
    }); 
        
}
export default authMiddleware;