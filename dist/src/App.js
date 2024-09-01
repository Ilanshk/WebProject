"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const image_route_1 = __importDefault(require("./routes/image_route"));
const http_1 = __importDefault(require("http"));
const socket_server_1 = __importDefault(require("./socket_server"));
const server = http_1.default.createServer(app);
const io = (0, socket_server_1.default)(server);
server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}!`);
});
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', (err) => console.error(err));
        db.once('open', () => console.log("connected to Mongo DB"));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/user", user_route_1.default);
            app.use("/auth", auth_route_1.default);
            app.use("/file", image_route_1.default);
            app.use("/uploads", express_1.default.static("uploads"));
            resolve(app);
        });
    });
    return promise;
};
exports.default = { initApp, server };
//# sourceMappingURL=App.js.map