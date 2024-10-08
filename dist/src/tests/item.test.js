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
let app;
let testingUser = {
    firstName: "testFirstItem",
    lastName: "testLastItem",
    email: "itemTest@gmail.com",
    password: "1234567",
    userImageUrl: "http://192.168.56.1:3000/1715429550383",
    userAge: "20",
    userCountry: "Israel"
};
let refreshToken = '';
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteOne({ email: testingUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send({ firstName: testingUser.firstName, lastName: testingUser.lastName, email: testingUser.email, password: testingUser.password, userImageUrl: testingUser.userImageUrl, userAge: testingUser.userAge, userCountry: testingUser.userCountry });
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: testingUser.email, password: testingUser.password });
    refreshToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
const items = [
    {
        text: "Item number 1"
    },
    {
        text: "Item number 2"
    },
];
describe("Item", () => {
    let itemId1, itemId2;
    test("Get /Item - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set('Authorization', 'Bearer ' + refreshToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    // test("POST /item 1 and GET this item",async()=>{
    //     const res = await  request(app)
    //         .post("/item")
    //         .set('Authorization','Bearer '+testingUser.accessToken)
    //         .send(items[0])
    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body.text).toEqual(items[0].text);
    //     itemId1 = res.body._id;
    //     const res2 = await request(app)
    //         .get("/item")
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(res2.statusCode).toBe(200);
    //     const data = res2.body;
    //     expect(data[0].text).toBe(items[0].text);
    // })
    // test("POST /item 2 and GET this item by id",async()=>{
    //     const res = await  request(app)
    //         .post("/item")
    //         .set('Authorization','Bearer '+testingUser.accessToken)
    //         .send(items[1])
    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body.text).toEqual(items[1].text);
    //     itemId2 = res.body._id;
    //     const res2 = await request(app)
    //         .get("/item/" + itemId2)
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(res2.statusCode).toBe(200);
    //     const data = res2.body;
    //     expect(data.text).toBe(items[1].text);
    // })
    // test("GET /item/:id",async () =>{
    //     const resFirstItem = await request(app)
    //         .get("/item/" +itemId1)
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(resFirstItem.statusCode).toBe(200);
    //     expect(resFirstItem.body.text).toBe(items[0].text);
    //     const resSecondItem = await request(app)
    //         .get("/item/" + itemId2)
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(resSecondItem.statusCode).toBe(200);
    //     expect(resSecondItem.body.text).toBe(items[1].text);
    // });
    // test("Fail GET /item/:id",async() =>{
    //     const res = await request(app)
    //         .get("/item/00000")
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(res.statusCode).toBe(404);
    // });
    // test("GET all items ",async () =>{
    //     const allItemsRes = await request(app)
    //         .get("/item")
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(allItemsRes.statusCode).toBe(200);
    //     expect(allItemsRes.body[0].text).toBe(items[0].text);
    //     expect(allItemsRes.body[1].text).toBe(items[1].text);
    // })
    // test("GET item by text", async() =>{
    //     const resItem = await request(app)
    //         .get("/item")
    //         .query({text:items[0].text})
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(resItem.statusCode).toBe(200);
    //     expect(resItem.body[0].text).toBe(items[0].text);
    // })
    // test("FAIL to get item by text", async() =>{
    //     const response = await request(app)
    //         .get("/item")
    //         .query({text:"wwerrt"})
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(response.statusCode).toBe(404);
    // })
    // test("PUT /item/:id",async()=>{
    //     const res = await request(app)
    //         .put("/item/"+itemId1)
    //         .set('Authorization','Bearer '+testingUser.accessToken)
    //         .send({text:"New Text For Item 1"});
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.text).toBe("New Text For Item 1");
    // })
    // test("FAIL to PUT item document",async() =>{
    //     const res = await request(app)
    //         .put("/item/"+itemId2)
    //         .set('Authorization','Bearer '+testingUser.accessToken)
    //         .send({text:[11,22]});
    //     expect(res.statusCode).toBe(400);
    // })
    // test("DELETE item by its ID",async() =>{
    //     const res =await request(app)
    //         .delete("/item/"+itemId1)
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(res.statusCode).toBe(200);
    //     const resp = await request(app)
    //         .get("/item/"+itemId1)
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(resp.statusCode).toBe(404);
    // })
    // test(" FAIL to DELETE item by its ID",async() =>{
    //     const res =await request(app)
    //         .delete("/item/E432")
    //         .set('Authorization','Bearer '+testingUser.accessToken);
    //     expect(res.statusCode).toBe(404);
    // })
});
//# sourceMappingURL=item.test.js.map