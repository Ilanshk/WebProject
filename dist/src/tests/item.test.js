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
const item_model_1 = __importDefault(require("../models/item_model"));
let app;
//is called before tests are performed in this file
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log("beforeAll");
    yield item_model_1.default.deleteMany();
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
        const res = yield (0, supertest_1.default)(app).get("/item");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    test("POST /item 1 and GET this item", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/item").send(items[0]);
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual(items[0].text);
        itemId1 = res.body._id;
        const res2 = yield (0, supertest_1.default)(app).get("/item");
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data[0].text).toBe(items[0].text);
    }));
    test("POST /item 2 and GET this item by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/item").send(items[1]);
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual(items[1].text);
        itemId2 = res.body._id;
        const res2 = yield (0, supertest_1.default)(app).get("/item/" + itemId2);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.text).toBe(items[1].text);
    }));
    test("GET /item/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFirstItem = yield (0, supertest_1.default)(app).get("/item/" + itemId1);
        expect(resFirstItem.statusCode).toBe(200);
        expect(resFirstItem.body.text).toBe(items[0].text);
        const resSecondItem = yield (0, supertest_1.default)(app).get("/item/" + itemId2);
        expect(resSecondItem.statusCode).toBe(200);
        expect(resSecondItem.body.text).toBe(items[1].text);
    }));
    test("Fail GET /item/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/item/00000");
        expect(res.statusCode).toBe(404);
    }));
    test("GET all items ", () => __awaiter(void 0, void 0, void 0, function* () {
        const allItemsRes = yield (0, supertest_1.default)(app).get("/item");
        expect(allItemsRes.statusCode).toBe(200);
        expect(allItemsRes.body[0].text).toBe(items[0].text);
        expect(allItemsRes.body[1].text).toBe(items[1].text);
    }));
    test("GET item by text", () => __awaiter(void 0, void 0, void 0, function* () {
        const resItem = yield (0, supertest_1.default)(app).get("/item").query({ text: items[0].text });
        expect(resItem.statusCode).toBe(200);
        expect(resItem.body[0].text).toBe(items[0].text);
    }));
    test("FAIL to get item by text", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/item").query({ text: "wwerrt" });
        expect(response.statusCode).toBe(404);
    }));
    test("PUT /item/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/item/" + itemId1).send({ text: "New Text For Item 1" });
        expect(res.statusCode).toBe(200);
        expect(res.body.text).toBe("New Text For Item 1");
    }));
    test("FAIL to PUT item document", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put("/item/" + itemId2).send({ text: [11, 22] });
        expect(res.statusCode).toBe(400);
    }));
    test("DELETE item by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete("/item/" + itemId1);
        expect(res.statusCode).toBe(200);
        const resp = yield (0, supertest_1.default)(app).get("/item/" + itemId1);
        expect(resp.statusCode).toBe(404);
    }));
    test(" FAIL to DELETE item by its ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete("/item/E432");
        expect(res.statusCode).toBe(400);
    }));
});
//# sourceMappingURL=item.test.js.map