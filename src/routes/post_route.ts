import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
router.get("/:id",authMiddleware,PostController.getById.bind(PostController));
router.get("/",authMiddleware, PostController.get.bind(PostController));

router.post("/",authMiddleware, PostController.post.bind(PostController));

router.put("/:id",authMiddleware,PostController.put.bind(PostController));
router.put("/",authMiddleware,PostController.put.bind(PostController)); //PUT with body in request


router.delete("/:id",authMiddleware, PostController.remove.bind(PostController));


export default router;