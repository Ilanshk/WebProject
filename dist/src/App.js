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
const student_route_1 = __importDefault(require("./routes/student_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const item_route_1 = __importDefault(require("./routes/item_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const image_route_1 = __importDefault(require("./routes/image_route"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', (err) => console.error(err));
        db.once('open', () => console.log("connected to Mongo DB"));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/student", student_route_1.default);
            app.use("/user", user_route_1.default);
            app.use("/post", post_route_1.default);
            app.use("/item", item_route_1.default);
            app.use("/auth", auth_route_1.default);
            app.use("/file", image_route_1.default);
            app.use("/uploads", express_1.default.static("uploads"));
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=App.js.map