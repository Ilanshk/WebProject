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
Object.defineProperty(exports, "__esModule", { value: true });
//import fs from 'mz/fs';
jest.setTimeout(30000);
let app;
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/profilePicture.png`;
        // const rs = await fs.exists(filePath);
        // if(rs){
        //     const response = await request(app)
        //         .post("/file/file?file=123.jpeg").attach('file',filePath)
        //     expect(response.statusCode).toEqual(200);
        // }
    }));
});
//# sourceMappingURL=file.test.js.map