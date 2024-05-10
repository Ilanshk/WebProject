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
const student_model_1 = __importDefault(require("../models/student_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const testUser = {
    email: "teststudent@gmail.com",
    password: "123456",
    accessToken: null
};
let app;
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield student_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
const students = [
    {
        name: "John Doe",
        _id: "12345",
        imageUrl: "",
    },
    {
        name: "Jane Doe 2",
        _id: "12346",
        imageUrl: "",
    },
];
describe("Student", () => {
    test("Get /Student - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/student")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    test("POST /student 1 and GET this student", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/student").send(students[0])
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[0].name);
        expect(res.body.imageUrl).toEqual(students[0].imageUrl);
        expect(res.body._id).toEqual(students[0]._id);
        //studentId = res.body._id; //save the ID for later tests
        const res2 = yield (0, supertest_1.default)(app).get("/student")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data[0].name).toBe(students[0].name);
        expect(data[0]._id).toBe(students[0]._id);
        expect(data[0].imageUrl).toBe(students[0].imageUrl);
    }));
    test("POST /student 2 and GET this student by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/student").send(students[1])
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[1].name);
        expect(res.body.imageUrl).toEqual(students[1].imageUrl);
        expect(res.body._id).toEqual(students[1]._id);
        //studentId = res.body._id; //save the ID for later tests
        const res2 = yield (0, supertest_1.default)(app).get("/student/" + students[1]._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.name).toBe(students[1].name);
        expect(data._id).toBe(students[1]._id);
        expect(data.imageUrl).toBe(students[1].imageUrl);
    }));
    test("GET /student/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFirstStudent = yield (0, supertest_1.default)(app).get("/student/" + students[0]._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resFirstStudent.statusCode).toBe(200);
        expect(resFirstStudent.body.name).toBe(students[0].name);
        expect(resFirstStudent.body._id).toBe(students[0]._id);
        expect(resFirstStudent.body.imageUrl).toBe(students[0].imageUrl);
        const resSecondStudent = yield (0, supertest_1.default)(app).get("/student/" + students[1]._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resSecondStudent.statusCode).toBe(200);
        expect(resSecondStudent.body.name).toBe(students[1].name);
        expect(resSecondStudent.body._id).toBe(students[1]._id);
        expect(resSecondStudent.body.imageUrl).toBe(students[1].imageUrl);
    }));
    test("Fail GET /student/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/student/00000")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(404);
    }));
    test("GET all students ", () => __awaiter(void 0, void 0, void 0, function* () {
        const allStudentsRes = yield (0, supertest_1.default)(app).get("/student")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(allStudentsRes.statusCode).toBe(200);
        expect(allStudentsRes.body[0].name).toBe(students[0].name);
        expect(allStudentsRes.body[0].imageUrl).toBe(students[0].imageUrl);
        expect(allStudentsRes.body[0]._id).toBe(students[0]._id);
        expect(allStudentsRes.body[1].name).toBe(students[1].name);
        expect(allStudentsRes.body[1].imageUrl).toBe(students[1].imageUrl);
        expect(allStudentsRes.body[1]._id).toBe(students[1]._id);
    }));
    test("GET student by name", () => __awaiter(void 0, void 0, void 0, function* () {
        const resStudent = yield (0, supertest_1.default)(app).get("/student").query({ name: "Jane Doe 2" })
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resStudent.statusCode).toBe(200);
        expect(resStudent.body[0].name).toBe(students[1].name);
        expect(resStudent.body[0].imageUrl).toBe(students[1].imageUrl);
        expect(resStudent.body[0]._id).toBe(students[1]._id);
    }));
    test("FAIL to get student by name", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/student").query({ name: "abc" })
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(response.statusCode).toBe(404);
    }));
    test("PUT /student/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/student/" + students[1]._id).send({ imageUrl: "url" })
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        console.log("Tets PUT /student/:id" + res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(students[1]._id);
        expect(res.body.name).toBe(students[1].name);
        expect(res.body.imageUrl).toBe("url");
    }));
    test("FAIL to PUT student document", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/student/" + students[1]._id).send({ imageUrl: { id: 80 } })
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(400);
    }));
    test("DELETE student by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete("/student/" + students[0]._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const resp = yield (0, supertest_1.default)(app).get("/student/" + students[0]._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resp.statusCode).toBe(404);
    }));
    test(" FAIL to DELETE student by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete("/student/788900")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=student.test.js.map