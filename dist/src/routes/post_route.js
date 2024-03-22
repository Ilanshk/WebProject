"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get("/:id", auth_middleware_1.default, post_controller_1.default.getById.bind(post_controller_1.default));
router.get("/", auth_middleware_1.default, post_controller_1.default.get.bind(post_controller_1.default));
router.post("/", auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
router.put("/:id", auth_middleware_1.default, post_controller_1.default.put.bind(post_controller_1.default));
router.put("/", auth_middleware_1.default, post_controller_1.default.put.bind(post_controller_1.default)); //PUT with body in request
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.remove.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map