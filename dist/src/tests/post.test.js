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
    firstName: "testFirst",
    lastName: "testLast",
    email: "postTest@gmail.com",
    password: "1234567",
    userImageUrl: "http://192.168.56.1:3000/1715429550383",
    userAge: "20",
    userCountry: "Israel"
};
let refreshToken = '';
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield App_1.default.initApp();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany({ _id: 1456227 });
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send({ firstName: testUser.firstName, lastName: testUser.lastName, email: testUser.email, password: testUser.password, userImageUrl: testUser.userImageUrl, userAge: testUser.userAge, userCountry: testUser.userCountry });
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: testUser.email, password: testUser.password });
    refreshToken = res.body.refreshToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
    App_1.default.server.close();
}));
const posts = [
    {
        _id: 1456227,
        postText: "post 1 text",
        owner: "Ilan",
        postImageUrl: "http://localhost:192.168.56.1:3000/647677368i7874397.jpg"
    },
    {
        _id: 1798438,
        postText: "post 2 text",
        owner: "Sagiv",
        postImageUrl: "http://localhost:192.168.56.1:3000/647677368i9074651.jpg"
    },
];
describe("Post", () => {
    let postId1, postId2;
    test("Create /post 1 and GET this post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/post")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send(posts[0]);
        expect(res.statusCode).toEqual(201);
        expect(res.body._id).toEqual(posts[0]._id);
        expect(res.body.postText).toEqual(posts[0].postText);
        expect(res.body.postImageUrl).toEqual(posts[0].postImageUrl);
        let owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId1 = res.body._id;
        console.log("PostID1", postId1);
        const res2 = yield (0, supertest_1.default)(app)
            .get("/post/" + postId1)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body; //OBJECT IS RETURNED
        console.log(data);
        expect(data._id).toBe(posts[0]._id);
        expect(data.postText).toBe(posts[0].postText);
        expect(data.postImageUrl).toBe(posts[0].postImageUrl);
        owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(data.owner)).toEqual(owner_id);
    }));
    test("Create /post 2 and GET this post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/post")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send(posts[1]);
        expect(res.statusCode).toEqual(201);
        expect(res.body._id).toEqual(posts[1]._id);
        expect(res.body.postText).toEqual(posts[1].postText);
        expect(res.body.postImageUrl).toEqual(posts[1].postImageUrl);
        let owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId2 = res.body._id;
        console.log("PostID2= ", postId2);
        const res2 = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data._id).toBe(posts[1]._id);
        expect(data.postText).toBe(posts[1].postText);
        expect(data.postImageUrl).toBe(posts[1].postImageUrl);
        owner_id = (yield (user_model_1.default.findOne({ email: testUser.email })))._id;
        expect(new mongoose_1.default.Types.ObjectId(data.owner)).toEqual(owner_id);
    }));
    test("GET /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFirstPost = yield (0, supertest_1.default)(app)
            .get("/post/" + postId1)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resFirstPost.statusCode).toBe(200);
        expect(resFirstPost.body._id).toBe(posts[0]._id);
        expect(resFirstPost.body.postText).toBe(posts[0].postText);
        expect(resFirstPost.body.postImageUrl).toBe(posts[0].postImageUrl);
        let postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(resFirstPost.body.owner)).toEqual(postOwner);
        const resSecondPost = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resSecondPost.statusCode).toBe(200);
        expect(resSecondPost.body._id).toBe(posts[1]._id);
        expect(resSecondPost.body.postText).toBe(posts[1].postText);
        expect(resSecondPost.body.postImageUrl).toBe(posts[1].postImageUrl);
        postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(resSecondPost.body.owner)).toEqual(postOwner);
    }));
    test("Fail GET /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post/00000")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res.statusCode).toBe(404);
    }));
    test("GET all posts ", () => __awaiter(void 0, void 0, void 0, function* () {
        const allPostsRes = yield (0, supertest_1.default)(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(allPostsRes.statusCode).toBe(200);
        const allPostsForTests = allPostsRes.body.filter((post) => post._id == 1456227 || post._id == 1798438);
        expect(allPostsForTests[0]._id).toBe(posts[0]._id);
        expect(allPostsForTests[0].postText).toBe(posts[0].postText);
        expect(allPostsForTests[0].postImageUrl).toBe(posts[0].postImageUrl);
        let postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(allPostsForTests[0].owner)).toEqual(postOwner);
        expect(allPostsForTests[1]._id).toBe(posts[1]._id);
        expect(allPostsForTests[1].postText).toBe(posts[1].postText);
        expect(allPostsForTests[1].postImageUrl).toBe(posts[1].postImageUrl);
        expect(new mongoose_1.default.Types.ObjectId(allPostsForTests[1].owner)).toEqual(postOwner);
    }));
    test("GET post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        console.log("owner id: " + ownerId);
        const resPost = yield (0, supertest_1.default)(app)
            .get("/post")
            .query({ owner: ownerId }) //return array
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resPost.statusCode).toBe(200);
        console.log(resPost.body);
        const filteredPosts = resPost.body.filter((post) => post.owner == ownerId);
        expect(filteredPosts[0]._id).toBe(posts[0]._id);
        expect(filteredPosts[0].postText).toBe(posts[0].postText);
        expect(filteredPosts[0].postImageUrl).toBe(posts[0].postImageUrl);
        expect(new mongoose_1.default.Types.ObjectId(filteredPosts[0].owner)).toEqual(ownerId);
    }));
    test("FAIL to get post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/post")
            .query({ title: { name: 'abc' } })
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(response.statusCode).toBe(404);
    }));
    test("PUT /post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId1)
            .set('Authorization', 'Bearer ' + refreshToken)
            .send({ postContent: "Updated text for post 1" });
        expect(res.statusCode).toBe(200);
        expect(res.body.postText).toBe("Updated text for post 1");
        expect(res.body._id).toBe(posts[0]._id);
        expect(res.body.postImageUrl).toBe(posts[0].postImageUrl);
        const postOwner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        expect(new mongoose_1.default.Types.ObjectId(res.body.owner)).toEqual(postOwner);
    }));
    test("FAIL to PUT post document", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId2)
            .set('Authorization', 'Bearer ' + refreshToken)
            .send({ owner: { count: 10 } });
        expect(res.statusCode).toBe(400);
    }));
    test("DELETE post by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(app)
            .delete("/post/" + postId2)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res1.statusCode).toBe(200);
        const resp = yield (0, supertest_1.default)(app)
            .get("/post/" + postId2)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resp.statusCode).toBe(404);
        const res2 = yield (0, supertest_1.default)(app)
            .delete("/post/" + postId1)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res1.statusCode).toBe(200);
        const resp2 = yield (0, supertest_1.default)(app)
            .get("/post/" + postId1)
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(resp2.statusCode).toBe(404);
    }));
    test(" FAIL to DELETE post by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/00000")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=post.test.js.map