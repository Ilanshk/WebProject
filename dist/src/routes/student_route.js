"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_controller_1 = __importDefault(require("../controllers/student_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
router.get("/", auth_middleware_1.default, student_controller_1.default.get.bind(student_controller_1.default));
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
router.get("/:id", auth_middleware_1.default, student_controller_1.default.getById.bind(student_controller_1.default));
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
router.post("/", auth_middleware_1.default, student_controller_1.default.post.bind(student_controller_1.default));
router.put("/:id", auth_middleware_1.default, student_controller_1.default.put.bind(student_controller_1.default));
router.delete("/:id", auth_middleware_1.default, student_controller_1.default.remove.bind(student_controller_1.default));
exports.default = router;
//# sourceMappingURL=student_route.js.map