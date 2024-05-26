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
const fs_1 = __importDefault(require("mz/fs"));
jest.setTimeout(30000);
let app;
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = "C:\WebSystemsClass\sce_frontend\sce_frontend\assets\avatar.png";
        console.log(filePath);
        const rs = yield fs_1.default.exists(filePath);
        if (rs) {
            const response = yield (0, supertest_1.default)(app)
                .post("/file/file?file=123.jpeg").attach('file', filePath);
            expect(response.statusCode).toEqual(200);
        }
    }));
});
//# sourceMappingURL=file.test.js.map