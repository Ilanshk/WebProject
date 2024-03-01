"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const item_controller_1 = __importDefault(require("../controllers/item_controller"));
router.get("/", item_controller_1.default.get.bind(item_controller_1.default));
router.get("/:id", item_controller_1.default.getById.bind(item_controller_1.default));
router.post("/", item_controller_1.default.post.bind(item_controller_1.default));
router.put("/:id", item_controller_1.default.put.bind(item_controller_1.default));
router.delete("/:id", item_controller_1.default.remove.bind(item_controller_1.default));
exports.default = router;
//# sourceMappingURL=item_route.js.map