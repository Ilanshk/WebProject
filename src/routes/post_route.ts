import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";

router.get("/:id",PostController.getById.bind(PostController));
router.get("/", PostController.get.bind(PostController));

router.post("/", PostController.post.bind(PostController));

router.put("/:id",PostController.put.bind(PostController));
router.put("/",PostController.put.bind(PostController)); //PUT with body in request


router.delete("/:id", PostController.remove.bind(PostController));


export default router;