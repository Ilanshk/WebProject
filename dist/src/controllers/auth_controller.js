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
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
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
        const userTokens = generateTokens(newUser._id.toString());
        return res.status(200).send({
            email: email,
            password: hashedPassword,
            tokens: userTokens
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
//Generate token for user
//TOKEN_SECRET is for the encryption of the token
//In this case it is not RSA algorithm
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({
        _id: userId //this is returned in the verify(if successful) in auth_middleware.ts
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: userId, //this is returned in the verify(if successful) in auth_middleware.ts
        salt: Math.random()
    }, process.env.REFRESH_TOKEN_SECRET);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
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
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        //save user document in db(update it)
        yield user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
const signInWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Loginticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = Loginticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ email: email });
            if (user == null) {
                //user not found, create new user
                user = yield user_model_1.default.create({
                    email: email,
                    password: '',
                    imageUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                    //what about tokens?
                });
            }
            const tokens = generateTokens(user._id.toString());
            return res.status(200).send({
                email: user.email,
                userImageUrl: user.userImageUrl,
                userTokens: tokens
            });
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const logout = (req, res) => {
    res.status(400).send("logout");
};
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //First extract token from HTTP header request
    const authHeader = req.headers['authorization']; // authorization Header =  bearer(TOKEN TYPE)+ " " + token
    const refreshTokenOriginal = authHeader && authHeader.split(' ')[1];
    if (refreshTokenOriginal == null) {
        return res.status(401).send("Missing Token");
    }
    //verify token
    jsonwebtoken_1.default.verify(refreshTokenOriginal, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            if (user == null || user.tokens == null || !user.tokens.includes(refreshTokenOriginal)) {
                if (user.tokens != null) {
                    user.tokens = []; //delete all refresh tokens of user, now no one can create new access token for that user
                    yield user.save();
                }
                return res.status(403).send("Invalid Token");
            }
            //generate new access token and refresh token
            const { accessToken, refreshToken } = generateTokens(user._id.toString());
            //delete old refresh token and update new refresh token in db
            user.tokens = user.tokens.filter(token => token != refreshTokenOriginal);
            user.tokens.push(refreshToken);
            yield user.save();
            //return new access token & new refresh token
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
    }));
});
exports.default = { register, login, logout, refresh, signInWithGoogle };
//# sourceMappingURL=auth_controller.js.map