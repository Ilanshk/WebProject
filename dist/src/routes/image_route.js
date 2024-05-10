"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const baseUrl = "http://192.168.56.1:3000/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log("multer storage callback");
        cb(null, Date.now().toString() + '.jpg');
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/file', auth_middleware_1.default, upload.single('file'), function (req, res) {
    res.status(200).send({ url: baseUrl + req.file.destination + req.file.filename });
});
exports.default = router;
//# sourceMappingURL=image_route.js.map