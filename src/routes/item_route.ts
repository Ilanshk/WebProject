import express from "express";
const router = express.Router();
import ItemController from "../controllers/item_controller";


router.get("/",ItemController.getAllItems);
router.get("/:id",ItemController.getItemById);

router.post("/",ItemController.createItem);

router.put("/:id",ItemController.updateItem);

router.delete("/:id",ItemController.deleteItem);

export default router;


