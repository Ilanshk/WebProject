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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const testUser = {
    email: "post@gmail.com",
    password: "123456",
    accessToken: null
};
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
const posts = [
    {
        title: "My First Post",
        message: "New Restaurant Opened",
        owner: "Ilan"
    },
    {
        title: "My Second Post",
        message: "Trip to Kineret",
        owner: "Ilan"
    },
];
describe("Post", () => {
    let postId1, postId2;
    test("Get /Post - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    test("Create /post 1 and GET this post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(posts[0]);
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[0].title);
        expect(res.body.message).toEqual(posts[0].message);
        let owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId1 = res.body._id;
        console.log("PostID1", postId1);
        const res2 = yield (0, supertest_1.default)(app)
            .get("/post/" + postId1)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body; //OBJECT IS RETURNED
        console.log(data);
        expect(data.title).toBe(posts[0].title);
        expect(data.message).toBe(posts[0].message);
        owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(data.owner)).toEqual(owner_id);
    }));
    test("Create /post 2 and GET this post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(posts[1]);
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[1].title);
        expect(res.body.message).toEqual(posts[1].message);
        let owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId2 = res.body._id;
        console.log("PostID2= ", postId2);
        const res2 = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.title).toBe(posts[1].title);
        expect(data.message).toBe(posts[1].message);
        owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(data.owner)).toEqual(owner_id);
    }));
    test("GET /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFirstPost = yield (0, supertest_1.default)(app)
            .get("/post/" + postId1)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resFirstPost.statusCode).toBe(200);
        expect(resFirstPost.body.title).toBe(posts[0].title);
        expect(resFirstPost.body.message).toBe(posts[0].message);
        let postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(resFirstPost.body.owner)).toEqual(postOwner);
        const resSecondPost = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resSecondPost.statusCode).toBe(200);
        expect(resSecondPost.body.title).toBe(posts[1].title);
        expect(resSecondPost.body.message).toBe(posts[1].message);
        postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(resSecondPost.body.owner)).toEqual(postOwner);
    }));
    test("Fail GET /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post/00000")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(404);
    }));
    test("GET all posts ", () => __awaiter(void 0, void 0, void 0, function* () {
        const allPostsRes = yield (0, supertest_1.default)(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(allPostsRes.statusCode).toBe(200);
        expect(allPostsRes.body[0].title).toBe(posts[0].title);
        expect(allPostsRes.body[0].message).toBe(posts[0].message);
        let postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(allPostsRes.body[0].owner)).toEqual(postOwner);
        expect(allPostsRes.body[1].title).toBe(posts[1].title);
        expect(allPostsRes.body[1].message).toBe(posts[1].message);
        expect(new mongoose_1.default.Types.ObjectId(allPostsRes.body[1].owner)).toEqual(postOwner);
    }));
    test("GET post by title", () => __awaiter(void 0, void 0, void 0, function* () {
        const resPost = yield (0, supertest_1.default)(app)
            .get("/post")
            .query({ title: posts[1].title }) //return array
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resPost.statusCode).toBe(200);
        console.log(resPost.body);
        expect(resPost.body[0].title).toBe(posts[1].title);
        expect(resPost.body[0].message).toBe(posts[1].message);
        const postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(resPost.body[0].owner)).toEqual(postOwner);
    }));
    test("FAIL to get post by title", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/post")
            .query({ title: 54490 })
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(response.statusCode).toBe(404);
    }));
    test("PUT /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId1)
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send({ title: "Updated Title" });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Updated Title");
        expect(res.body.message).toBe(posts[0].message);
        const postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(postOwner);
    }));
    test("FAIL to PUT post document", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId2)
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send({ owner: 1111 });
        expect(res.statusCode).toBe(400);
    }));
    test("DELETE post by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/" + postId2)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const resp = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resp.statusCode).toBe(404);
    }));
    test(" FAIL to DELETE post by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/00000")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=post.test.js.map