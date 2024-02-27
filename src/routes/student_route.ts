import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";


//Important: We can not pass as an argument a pointer to a function of an object. 
//We need to have the object first in order to run the function.
//What we can do is telling TS to keep the function binded to its object, and not take it out of the object
//we use bind to connect the function to its object

router.get("/",StudentController.get.bind(StudentController));
router.get("/:id",StudentController.getById.bind(StudentController));
router.post("/",StudentController.post.bind(StudentController));
router.put("/:id",StudentController.put.bind(StudentController));
router.delete("/:id",StudentController.remove.bind(StudentController));

export default router;