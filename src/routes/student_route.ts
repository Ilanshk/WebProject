import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";
import authMiddleware from "../common/auth_middleware";

//Important: We can not pass as an argument a pointer to a function of an object. 
//We need to have the object first in order to run the function.
//What we can do is telling TS to keep the function binded to its object, and not take it out of the object
//we use bind to connect the function to its object


//First, authMiddleware is running to check if user is authenticated. If this function calls next()
//then the function which is passed as the 3rd argument will be executed
router.get("/",authMiddleware,StudentController.get.bind(StudentController));
router.get("/:id",authMiddleware,StudentController.getById.bind(StudentController));
router.post("/",authMiddleware,StudentController.post.bind(StudentController));
router.put("/:id",authMiddleware,StudentController.put.bind(StudentController));
router.delete("/:id",authMiddleware,StudentController.remove.bind(StudentController));

export default router;