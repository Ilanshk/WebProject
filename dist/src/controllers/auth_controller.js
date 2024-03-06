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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("Missing Email or Password");
    }
    //check in db that such user does not exist
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).send("User already exists");
        }
        //user does not exist, encrypt his password and create new instance
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            email: email,
            password: hashedPassword
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("Missing Email or Password");
    }
    //User passed email and password, now identify user in db
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("Invalid Email or Password");
        }
        const isValidPassword = bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).send("Invalid Email or Password ");
        }
        //Generate token for user
        //TOKEN_SECRET is for the encryption of the token
        //In this case it is not RSA algorithm
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user.id //this is returned in the verify(if successful) in auth_middleware.ts
        }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        return res.status(200).send({ accessToken: accessToken });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
const logout = (req, res) => {
    res.status(400).send("logout");
};
exports.default = { register, login, logout };
//# sourceMappingURL=auth_controller.js.map