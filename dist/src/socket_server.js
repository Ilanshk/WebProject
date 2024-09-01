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
const socket_io_1 = require("socket.io");
let usersSockets = new Map();
//Function from Github which helps to do an accurate calculation of the key
//Refernce can be found in the project's report
const modularExponentiation = (a, b, n) => {
    a = a % n;
    var result = 1;
    var x = a;
    while (b > 0) {
        var leastSignificantBit = b % 2;
        b = Math.floor(b / 2);
        if (leastSignificantBit == 1) {
            result = result * x;
            result = result % n;
        }
        x = x * x;
        x = x % n;
    }
    return result;
};
module.exports = (server) => {
    const io = new socket_io_1.Server(server, { cors: {
            origin: "http://10.0.2.2:8081",
        }, });
    io.on('connection', (socket) => {
        console.log('a user connected ' + socket.id);
        socket.join("chatRoom");
        socket.onAny((eventName, args) => {
            console.log("on event: " + eventName);
            socket.emit('echo', args);
        });
        //The server sends the encrypted message to the users in the room "chatRoom"
        socket.on('sendMessage', (message) => {
            io.sockets.to("chatRoom").emit('getMessage', { "content": message.messageContent, "owner": message.owner, "time": message.time });
        });
        // The server calculates its private key and keeps the user's socket in a dictionary.
        socket.on("getPublicKeyServer", (clientKey, callback) => {
            usersSockets.set(socket.id, modularExponentiation(clientKey.key, parseInt(process.env.SERVER_CODE), parseInt(process.env.P_VALUE)));
            callback({ key: usersSockets.get(socket.id) });
        });
        //The server calculates its public key and sends to client
        socket.on("setPublicKeyServer", (callbackFn) => __awaiter(void 0, void 0, void 0, function* () {
            const gValue = parseInt(process.env.G_VALUE);
            const pValue = parseInt(process.env.P_VALUE);
            const sCode = parseInt(process.env.SERVER_CODE);
            const res = modularExponentiation(gValue, sCode, pValue);
            callbackFn({ publicKey: [res, pValue, gValue] });
        }));
        //The server sends its dictionary of users
        socket.on("getKeysFromServer", (callback) => __awaiter(void 0, void 0, void 0, function* () {
            callback({ data: Array.from(usersSockets) });
        }));
        //Remove  socket of a user from the server's dictionary
        socket.on("RemoveSocket", (socket) => {
            usersSockets.delete(socket.socketID);
        });
    });
    return io;
};
//# sourceMappingURL=socket_server.js.map