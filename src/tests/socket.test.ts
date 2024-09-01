import App from "../App"
import mongoose from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

describe("socket Test", () => {
    let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>

    beforeAll((done) => {
        clientSocket = Client("http://localhost:" + process.env.PORT)
        clientSocket.on("connect", done);
    });

    afterAll(() => {
        App.server.close()
        clientSocket.close()
        mongoose.connection.close()
    });

    test("event test", (done) => {
        clientSocket.onAny((eventName,arg) => {
            console.log("on any")
            expect(eventName).toBe('echo');
            expect(arg.msg).toBe('hello');
            done();
        });
        clientSocket.emit("hello", {'msg':'hello'})
    });
});