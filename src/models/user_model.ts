import mongoose from "mongoose";

export interface IUser{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    userImageUrl:string;
    tokens:string[];
    userAge:String,
    userCountry:String
}

const userSchema = new mongoose.Schema<IUser>({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
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
        required:true 
    },
    //If we let the user to enter the app from multiple places like personal computer,phone,tablet,etc.
    //then we keep a refresh token for each instance of the app
    //If we let the user to enter the app from a single place,then we keep a single refresh token
    tokens:{
        type:[String]
    },
    userAge:{
        type:String,
        required:false,
    },
    userCountry:{
        type:String,
        required:false,
    }
});

export default mongoose.model<IUser>("User",userSchema);