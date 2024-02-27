"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const item_controller_1 = __importDefault(require("../controllers/item_controller"));
router.get("/", item_controller_1.default.getAllItems);
router.get("/:id", item_controller_1.default.getItemById);
router.post("/", item_controller_1.default.createItem);
router.put("/:id", item_controller_1.default.updateItem);
router.delete("/:id", item_controller_1.default.deleteItem);
exports.default = router;
//# sourceMappingURL=item_route.js.map