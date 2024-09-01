"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("../App"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
describe("socket Test", () => {
    let clientSocket;
    beforeAll((done) => {
        clientSocket = (0, socket_io_client_1.default)("http://localhost:" + process.env.PORT);
        clientSocket.on("connect", done);
    });
    afterAll(() => {
        App_1.default.server.close();
        clientSocket.close();
        mongoose_1.default.connection.close();
    });
    test("event test", (done) => {
        clientSocket.onAny((eventName, arg) => {
            console.log("on any");
            expect(eventName).toBe('echo');
            expect(arg.msg).toBe('hello');
            done();
        });
        clientSocket.emit("hello", { 'msg': 'hello' });
    });
});
//# sourceMappingURL=socket.test.js.map