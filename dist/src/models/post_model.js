"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    _id: {
        type: Number,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    postImageUrl: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model("Post", postSchema);
//# sourceMappingURL=post_model.js.map