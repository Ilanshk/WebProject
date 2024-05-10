import mongoose from 'mongoose';


export interface IStudent{
    name:String,
    _id:String,
    imageUrl:Number

}
const studentSchema = new mongoose.Schema<IStudent>({
    name:{
        type:String,
        required: true,
    },
    _id:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:false,
    },
});
export default mongoose.model<IStudent>("Student",studentSchema);