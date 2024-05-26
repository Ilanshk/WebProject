"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: User
*   description: The User API
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
*     User:
*       type: object
*       required:
*         - _id
*         - firstName
*         - lastName
*         - email
*         - password
*         - userImageUrl
*         - userAge
*         - userCountry
*       properties:
*         _id:
*           type: string
*           description: The user's identifier
*         firstName:
*           type: string
*           description: The user's first name
*         lastName:
*           type: string
*           description: The user's last name
*         email:
*           type: string
*           description: The user's email which with he/she registered
*         password:
*           type: string
*           description: The user's password which with he/she registered
*         userImageUrl:
*           type: string
*           description: The user's profile image url
*         userAge:
*           type: string
*           description: The user's age
*         userCountry:
*           type: string
*           description: The user's country
*       example:
*         _id: 'd9j3nhj4jdi29sjqosnbs'
*         firstName: 'Ilan'
*         lastName: 'AAA'
*         email: 'usertest@gmail.com'
*         password: '$tokswkdmkn4lmld.rqojromkd'
*         userImageUrl : 'http://path_to_image'
*         userAge: '20'
*         userCountry: 'Israel'
*/
/**
* @swagger
* /user/{id}:
*   get:
*     summary: Get a User by a given ID
*     tags: [User]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           format: ObjectId
*         description: Unique ID of the User to retrieve
*     responses:
*       200:
*         description: User accepted successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Error in getting User
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: User was not found
*/
router.get("/:id", auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
/**
* @swagger
* /user/{id}:
*   put:
*     summary: update user details according to a given ID of a user
*     tags: [User]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           format: ObjectId
*         description: Unique ID of the User to update
*     responses:
*       200:
*         description: User accepted successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Error in getting User
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: User was not found
*/
router.put("/:id", auth_middleware_1.default, user_controller_1.default.put.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map