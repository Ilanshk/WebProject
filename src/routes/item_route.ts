import express from "express";
const router = express.Router();
import ItemController from "../controllers/item_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/",authMiddleware,ItemController.get.bind(ItemController));
router.get("/:id",authMiddleware,ItemController.getById.bind(ItemController));

router.post("/",authMiddleware,ItemController.post.bind(ItemController));

router.put("/:id",authMiddleware,ItemController.put.bind(ItemController));

router.delete("/:id",authMiddleware,ItemController.remove.bind(ItemController));

export default router;


