import mongoose from "mongoose";

export interface IUser{
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema<IUser>({
    email:{ //it a unique name of the user, not necessary its email
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

export default mongoose.model<IUser>("User",userSchema);