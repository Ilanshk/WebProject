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
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("../models/item_model"));
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get All Items");
    let item;
    try {
        if (req.query.text) {
            item = yield item_model_1.default.find({ text: req.query.text });
            if (item.length == 0)
                return res.status(404).send("Item Not Found");
            else
                return res.status(200).send(item);
        }
        else {
            item = yield item_model_1.default.find();
            return res.status(200).send(item);
        }
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let item;
    try {
        item = yield item_model_1.default.findById(new mongoose_1.default.Types.ObjectId(req.params.id));
        if (item)
            res.status(200).send(item);
        else
            res.status(404).send("Item Not Found");
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Create New Item");
    let newItem;
    try {
        newItem = yield item_model_1.default.create(req.body);
        res.status(201).send(newItem);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Update Item");
    let updatedItem;
    try {
        if (req.params.id) {
            if (req.body.text) {
                updatedItem = yield item_model_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.params.id) }, { $set: { text: req.body.text } }, { returnDocument: "after" });
            }
        }
        if (req.query.id) {
            const item = yield item_model_1.default.find({ text: req.query.id });
            console.log("ITEM TO FIND", item);
            if (item && req.query.text)
                updatedItem = yield item_model_1.default.findOneAndUpdate({ _id: item[0]._id }, { $set: { text: req.query.text } }, { returnDocument: "after" });
        }
        if (updatedItem) {
            console.log("UPDATED ITEM", updatedItem);
            return res.status(200).send(updatedItem);
        }
        else
            return res.status(400).send("Item Update Failed");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Delete Item");
    try {
        if (req.params.id) {
            const resultOfDelete = yield item_model_1.default.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(req.params.id) });
            if (resultOfDelete.deletedCount == 1) {
                return res.status(200).send("Successful delete");
            }
            else
                return res.status(404).send("Item was not Found");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
exports.default = { getAllItems, getItemById, createItem, updateItem, deleteItem };
//# sourceMappingURL=item_controller.js.map