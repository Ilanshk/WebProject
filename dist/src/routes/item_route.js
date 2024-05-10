"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const item_controller_1 = __importDefault(require("../controllers/item_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: Item
*   description: The Item API
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
*     Item:
*       type: object
*       required:
*         - _id
*         - text
*       properties:
*         _id:
*           type: ObjectId
*           description: The Item's unique identifier
*         text:
*           type: string
*           description: The Item's description
*       example:
*         _id: '3b45ra7ne1dq'
*         text: 'My Item description...'
*/
/**
* @swagger
* /item:
*   get:
*     summary: Get all existing Items
*     tags: [Item]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Retrieved all existing Items
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Item'
*       400:
*         description: Error in retrieving Items
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*/
router.get("/", auth_middleware_1.default, item_controller_1.default.get.bind(item_controller_1.default));
/**
* @swagger
* /item/{id}:
*   get:
*     summary: Get an Item by a given ID
*     tags: [Item]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           example: '12m34a5k'
*         description: Unique ID of the Item to retrieve
*     responses:
*       200:
*         description: Item accepted successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Item'
*       400:
*         description: Error in getting Item
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Item was not found
*/
router.get("/:id", auth_middleware_1.default, item_controller_1.default.getById.bind(item_controller_1.default));
/**
* @swagger
* /item:
*   post:
*     summary: Create a new Item
*     tags: [Item]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: string
*             description: The item's description
*           example:
*             text: "My Item's description..."
*
*     responses:
*       201:
*         description: New Item Created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Item'
*       400:
*         description: Error Creating Item - Bad Request
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*/
router.post("/", auth_middleware_1.default, item_controller_1.default.post.bind(item_controller_1.default));
/**
* @swagger
* /item/{id}:
*   put:
*     summary: Update Item's details using given ID
*     tags: [Item]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           example: '12345'
*         description: Item ID to update
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                text:
*                  type: string
*                  description: The Item's description
*              example:
*                text: 'Item Description...'

*     responses:
*       200:
*         description: Item Details successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Item'
*       400:
*         description: Error Updating Item - Bad Request
*       401:
*         description: Missing Token
*       403:
*        description: Invalid Token
*       404:
*         description: Item to update was not found
*
*/
router.put("/:id", auth_middleware_1.default, item_controller_1.default.put.bind(item_controller_1.default));
/**
* @swagger
* /item/{id}:
*   delete:
*     summary: Delete Item of a given ID
*     tags: [Item]
*     security:
*       - bearerAuth : []
*     parameters:
*       - in: 'path'
*         name: 'id'
*         required: true
*         schema:
*           type: string
*           example: '12345'
*         description: ID of the Item to delete
*     responses:
*       200:
*         description: Item deleted successfully
*       400:
*         description: Error deleting Item- Bad Request
*       401:
*         description: Missing Token
*       403:
*         description: Invalid Token
*       404:
*         description: Item to delete was not found
*
*/
router.delete("/:id", auth_middleware_1.default, item_controller_1.default.remove.bind(item_controller_1.default));
exports.default = router;
//# sourceMappingURL=item_route.js.map