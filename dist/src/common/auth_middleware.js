"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("auth middleware");
    console.log("Token: " + req.headers['authorization']);
    //extract token from http header and check if it is valid
    //if the token is valid, it means the user logged-in-->call next()
    //from the token we can retrieve the user id as we declared in jwt.sign()
    const authHeader = req.headers['authorization']; // authorization Header =  bearer(TOKEN TYPE)+ " " + token
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send("Missing Token");
    }
    //token received, now verify it
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        req.body.user = user; //Keep user's data for using it in the express pipeline
        next();
    });
});
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map