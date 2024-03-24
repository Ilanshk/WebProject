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

/**
* @swagger
* tags:
*   name: Student
*   description: The Student API 
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT   
*/

/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - _id
*         - name
*         - age
*       properties:
*         _id:
*           type: string
*           description: The student's identifier
*         name:
*           type: string
*           description: The student's name
*         age:
*           type: Number
*           description: The student's age
*       example:
*         _id: 'd9j3nhj4jdi29sjqosnbs' 
*         name: 'Ilan'
*         age: 22
*/


/**
* @swagger
* /student:
*   get:
*     summary: Get all Students existing or all students according to a specific requirement
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: list of all the students
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Student'
*       401:
*         description: Missing Token
*       403:
*         description: Token is not valid
*       404:
*         description: student was not found
*/
router.get("/",authMiddleware,StudentController.get.bind(StudentController));


/**
* @swagger
* /student/{id}:
*   get:
*     summary: Get a student according to its id given as a parameter
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: 'string'
*           example: '12345'
*         description: Unique ID of the student to retrieve
*     responses:
*       200:
*         description: A student with ID passed as a parameter
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Student'
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Student was not found
*/
router.get("/:id",authMiddleware,StudentController.getById.bind(StudentController));


/**
* @swagger
* /student:
*   post:
*     summary: Create a new Student
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Student'
*     responses:
*        201:
*          description: Student created successfully
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Student'
*        401:
*          description: Missing Token
*        403:
*          description: Invalid Token
*         
*/
router.post("/",authMiddleware,StudentController.post.bind(StudentController));


/**
* @swagger
* /student/{id}:
*   put:
*     summary: Update student's age
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - age
*             properties:
*               age:
*                 type: Number
*                 description: The student's age
*             example:
*               age: 20
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: 'string'
*           example: '12345'
*         description: Unique ID of the student to change its age
*     responses:
*       200:
*         description: Student age was updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Student'
*       400:
*         description: Error in updating Student's age
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Student to update was not found
* 
*/
router.put("/:id",authMiddleware,StudentController.put.bind(StudentController));


/**
* @swagger
* /student/{id}:
*   delete:
*     summary: Delete student with provided ID
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: 'string'
*           example: '12345'
*         description: Unique ID of the student to delete
*     responses:
*       200:
*         description: Student was deleted successfully
*       400:
*         description: Error in Deleting Student
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Student to delete was not found
* 
*/
router.delete("/:id",authMiddleware,StudentController.remove.bind(StudentController));

export default router;