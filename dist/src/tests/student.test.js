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
const testUser = {
    firstName: "testFirstStudent",
    lastName: "testLastStudent",
    email: "userTest@gmail.com",
    password: "1234567",
    userImageUrl: "http://192.168.56.1:3000/1715429550383",
    userAge: "20",
    userCountry: "Israel"
};
let refreshToken = '';
let testUserId = '';
let app;
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send({ firstName: testUser.firstName, lastName: testUser.lastName, email: testUser.email, password: testUser.password, userImageUrl: testUser.userImageUrl, userAge: testUser.userAge, userCountry: testUser.userCountry });
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: testUser.email, password: testUser.password });
    testUserId = res.body.userId;
    refreshToken = res.body.refreshToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
describe("User", () => {
    test("GET /user/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFirstStudent = yield (0, supertest_1.default)(app).get("/user/" + testUserId)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resFirstStudent.statusCode).toBe(200);
        expect(resFirstStudent.body.firstName).toBe(testUser.firstName);
        expect(resFirstStudent.body.lastName).toBe(testUser.lastName);
        expect(resFirstStudent.body.email).toBe(testUser.email);
        expect(resFirstStudent.body.userImageUrl).toBe(testUser.userImageUrl);
        expect(resFirstStudent.body.userAge).toBe(testUser.userAge);
        expect(resFirstStudent.body.userCountry).toBe(testUser.userCountry);
    }));
    test("Fail GET /user/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/user/00000")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res.statusCode).toBe(404);
    }));
    test("PUT /user/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/user/" + testUserId).send({ userImageUrl: "url" })
            .set('Authorization', 'Bearer ' + refreshToken);
        const userImageUrl = (yield user_model_1.default.findOne({ email: testUser.email })).userImageUrl;
        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe(testUser.firstName);
        expect(res.body.lastName).toBe(testUser.lastName);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.userImageUrl).toBe(userImageUrl);
        expect(res.body.userAge).toBe(testUser.userAge);
        expect(res.body.userCountry).toBe(testUser.userCountry);
    }));
    test("FAIL to PUT user document", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/user/" + testUserId).send({ userImageUrl: { id: 80 } })
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res.statusCode).toBe(400);
    }));
});
//# sourceMappingURL=student.test.js.map