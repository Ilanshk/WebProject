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
const supertest_1 = __importDefault(require("supertest"));
const App_1 = __importDefault(require("../App"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const user = {
    firstName: "userAuthFirst",
    lastName: "userAuthLast",
    email: "testAuth@gmail.com",
    password: "123456",
    userImageUrl: "http://http://192.168.56.1:3000/1715429550383",
    userAge: "20",
    userCountry: "Israel"
};
let app;
let accessToken = "";
let refreshToken = "";
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ email: user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
describe("Auth test", () => {
    test("Post /register", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password, userImageUrl: user.userImageUrl, userAge: user.userAge, userCountry: user.userCountry });
        expect(res.statusCode).toBe(200);
    }));
    test("Post /login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user.email, password: user.password });
        expect(res.statusCode).toBe(200);
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        //Here we add the authorization field to the request
        const res2 = yield (0, supertest_1.default)(app).get("/post/").set('Authorization', 'Bearer ' + refreshToken);
        expect(res2.statusCode).toBe(200);
        const fakeToken = accessToken + "0";
        const res3 = yield (0, supertest_1.default)(app).get("/student/").set('Authorization', 'Bearer ' + fakeToken);
        expect(res3.statusCode).not.toBe(200);
    }));
    const timeout = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };
    jest.setTimeout(100000);
    test("refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user.email, password: user.password });
        expect(res.statusCode).toBe(200);
        //const accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken;
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).toBe(200);
        refreshToken = res2.body.refreshToken;
        accessToken = res2.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();
        const res3 = yield (0, supertest_1.default)(app).get("/post")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res3.statusCode).toBe(200);
        //check token expiration - sleep 6 seconds and check if access token is expired
        yield timeout(6000);
        const res4 = yield (0, supertest_1.default)(app).get("/post")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res4.statusCode).not.toBe(200);
    }));
    test("refresh token after expiration", () => __awaiter(void 0, void 0, void 0, function* () {
        //check token expiration - sleep 6 seconds and check if access token is expired
        yield timeout(6000);
        const res = yield (0, supertest_1.default)(app).get("/post")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).not.toBe(200);
        const res1 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res1.statusCode).toBe(200);
        refreshToken = res1.body.refreshToken;
        accessToken = res1.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();
        const res2 = yield (0, supertest_1.default)(app).get("/post")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res2.statusCode).toBe(200);
    }));
    test("refresh token violation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        const oldRefreshToken = refreshToken;
        if (oldRefreshToken == res.body.refreshToken) {
            console.log("refresh token is the same");
        }
        expect(res.statusCode).toBe(200);
        refreshToken = res.body.refreshToken;
        accessToken = res.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();
        const res1 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + oldRefreshToken)
            .send();
        expect(res1.statusCode).not.toBe(200);
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).not.toBe(200);
    }));
});
//# sourceMappingURL=auth.test.js.map