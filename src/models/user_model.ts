import mongoose from "mongoose";

export interface IUser{
    email:string;
    password:string;
    userImageUrl:string;
    tokens:string[];
}

const userSchema = new mongoose.Schema<IUser>({
    email:{ //it a unique name of the user, not necessary its email
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    userImageUrl:{
        type:String,
        required:false 
    },
    //If we let the user to enter the app from multiple places like personal computer,phone,tablet,etc.
    //then we keep a refresh token for each instance of the app
    //If we let the user to enter the app from a single place,then we keep a single refresh token
    tokens:{
        type:[String]
    }
});

export default mongoose.model<IUser>("User",userSchema);