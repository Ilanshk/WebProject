import express from "express";
const router = express.Router();
import ItemController from "../controllers/item_controller";


router.get("/",ItemController.get.bind(ItemController));
router.get("/:id",ItemController.getById.bind(ItemController));

router.post("/",ItemController.post.bind(ItemController));

router.put("/:id",ItemController.put.bind(ItemController));

router.delete("/:id",ItemController.remove.bind(ItemController));

export default router;


