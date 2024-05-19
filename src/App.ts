import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRoute from "./routes/student_route";
import userRoute from "./routes/user_route";
import postRoute from "./routes/post_route";
import itemRoute from "./routes/item_route";
import authRoute from "./routes/auth_route";
import imageRouter from "./routes/image_route";
import multer from "multer";

const initApp = () =>{
    
    const promise = new Promise<Express>((resolve)=>{
        const db = mongoose.connection;
        db.on('error',(err)=>console.error(err));
        db.once('open',()=>console.log("connected to Mongo DB"));
        mongoose.connect(process.env.DATABASE_URL).then(()=>{
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended:true}));
            app.use("/student",studentRoute);
            app.use("/user",userRoute);
            app.use("/post",postRoute);
            app.use("/item",itemRoute);
            app.use("/auth",authRoute);
            app.use("/file",imageRouter);
            app.use("/uploads",express.static("uploads"))
            resolve(app);
        });
    });
    return promise;  
};

export default initApp;