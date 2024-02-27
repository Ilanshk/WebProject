import mongoose from "mongoose";


export interface IPost{
    title:String,
    message:String,
    owner:String
}
const postSchema = new mongoose.Schema<IPost>({
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    owner:{ //user who upload post
        type:String,
        required:true
    }
    

    
})

export default mongoose.model<IPost>("Post",postSchema);