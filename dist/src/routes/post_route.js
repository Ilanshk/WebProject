"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: Post
*   description: The Post API
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
*     ObjectId:
*       type: string
*       description: A string representing MongoDB's ObjectId
*/
/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - _id
*         - title
*         - message
*         - owner
*       properties:
*         _id:
*           type: string
*           format: ObjectId
*           description: The post's unique identifier
*         title:
*           type: string
*           description: The post's title
*         message:
*           type: string
*           description: The post's content
*         owner:
*           type: string
*           format: ObjectId
*           description: The user's identifier who wrote the post
*       example:
*         _id: 'a7b9d3l1aipc8301gco'
*         title: 'My post Title'
*         message: 'some content...'
*         owner: '12345'
*/
/**
* @swagger
* /post/{id}:
*   get:
*     summary: Get a post by a given ID
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           format: ObjectId
*         description: Unique ID of the post to retrieve
*     responses:
*       200:
*         description: Post accepted successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       400:
*         description: Error in getting post
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Post was not found
*/
router.get("/:id", auth_middleware_1.default, post_controller_1.default.getById.bind(post_controller_1.default));
/**
* @swagger
* /post:
*   get:
*     summary: Get all existing posts
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Retrieved all existing posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*       400:
*         description: Error in retrieving posts
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*/
router.get("/", auth_middleware_1.default, post_controller_1.default.get.bind(post_controller_1.default));
/**
* @swagger
* /post:
*   post:
*     summary: Create a new Post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: The post's title
*               message:
*                 type: string
*                 description: The post's content
*           example:
*             title: My Post Title
*             message: My Post Content
*     responses:
*       201:
*         description: New Post Created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       400:
*         description: Error Creating Post - Bad Request
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*/
router.post("/", auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
/**
* @swagger
* /post/{id}:
*   put:
*     summary: Update Post's details using given ID
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           format: ObjectId
*         description: Post ID to update
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                title:
*                  type: string
*                  description: The Post's title
*                message:
*                  type: string
*                  description: The Post's content
*              example:
*                title: 'post Title'
*                message: 'Post content'
*     responses:
*       200:
*         description: Post Details successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       400:
*         description: Error Updating post - Bad Request
*       401:
*         description: Missing Token
*       403:
*        description: Invalid Token
*       404:
*         description: Post to update was not found
*
*/
router.put("/:id", auth_middleware_1.default, post_controller_1.default.put.bind(post_controller_1.default));
/**
* @swagger
* /post/{id}:
*   delete:
*     summary: Delete post of a given ID
*     tags: [Post]
*     security:
*       - bearerAuth : []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           format: ObjectId
*         description: ID of the Post to delete
*     responses:
*       200:
*         description: Post deleted successfully
*       400:
*         description: Error deleting Post- Bad Request
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Post to delete was not found
*
*/
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.remove.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map