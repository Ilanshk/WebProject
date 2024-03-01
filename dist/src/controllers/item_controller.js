"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_model_1 = __importDefault(require("../models/item_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const ItemController = new base_controller_1.default(item_model_1.default);
exports.default = ItemController;
//# sourceMappingURL=item_controller.js.map