"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
class UserController extends base_controller_1.default {
    constructor() {
        super(user_model_1.default);
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map