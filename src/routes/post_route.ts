import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

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
*     Post:
*       type: object
*       required:
*         - _id
*         - title
*         - message
*         - owner
*       properties:
*         _id:
*           type: mongoose.Types.ObjectId
*           description: The post's unique identifier
*         title:
*           type: string
*           description: The post's title
*         message:
*           type: string
*           description: The post's content
*         owner:
*           type: mongoose.Types.ObjectId
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
*           type: 'string'
*           example: '12345'
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
router.get("/:id",authMiddleware,PostController.getById.bind(PostController));


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
router.get("/",authMiddleware, PostController.get.bind(PostController));


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
router.post("/",authMiddleware, PostController.post.bind(PostController));


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
*         name: postId
*         required: true
*         schema:
*           type: string
*           example: '12345'
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
router.put("/:id",authMiddleware,PostController.put.bind(PostController));



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
*         name: postID
*         required: true
*         schema:
*           type: string
*           example: '12345'
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
router.delete("/:id",authMiddleware, PostController.remove.bind(PostController));


export default router;