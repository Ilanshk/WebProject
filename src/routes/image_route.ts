import express, { Request ,Response} from 'express';
import multer from 'multer';
const router = express.Router();
import authMiddleware from "../common/auth_middleware"

const baseUrl = "http://192.168.56.1:3000/";
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        console.log("multer storage callback");
        cb(null,Date.now().toString()+ '.jpg')
    }
})

const upload = multer({storage});


router.post('/file',upload.single('file'),function (req:Request,res:Response) {
    res.status(200).send({url:baseUrl+ req.file.destination+req.file.filename})

})

export default router;