"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_controller_1 = __importDefault(require("../controllers/student_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
//Important: We can not pass as an argument a pointer to a function of an object. 
//We need to have the object first in order to run the function.
//What we can do is telling TS to keep the function binded to its object, and not take it out of the object
//we use bind to connect the function to its object
//First, authMiddleware is running to check if user is authenticated. If this function calls next()
//then the function which is passed as the 3rd argument will be executed
router.get("/", auth_middleware_1.default, student_controller_1.default.get.bind(student_controller_1.default));
router.get("/:id", auth_middleware_1.default, student_controller_1.default.getById.bind(student_controller_1.default));
router.post("/", auth_middleware_1.default, student_controller_1.default.post.bind(student_controller_1.default));
router.put("/:id", auth_middleware_1.default, student_controller_1.default.put.bind(student_controller_1.default));
router.delete("/:id", auth_middleware_1.default, student_controller_1.default.remove.bind(student_controller_1.default));
exports.default = router;
//# sourceMappingURL=student_route.js.map