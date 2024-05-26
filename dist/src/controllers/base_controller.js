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
class BaseController {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get");
            try {
                if (req.query.name != null) {
                    console.log("name");
                    const item = yield this.itemModel.find({ name: req.query.name });
                    if (item.length == 0) {
                        return res.status(404).send("Student Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                if (req.query.title != null) {
                    console.log("title");
                    const item = yield this.itemModel.find({ title: req.query.title });
                    if (item.length == 0) {
                        return res.status(404).send("Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                if (req.query.text != null) {
                    console.log("text");
                    const item = yield this.itemModel.find({ text: req.query.text });
                    if (item.length == 0) {
                        return res.status(404).send("Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                if (req.query.owner != null) {
                    console.log("owner");
                    console.log(req.query);
                    const item = yield this.itemModel.find({ owner: req.query.owner });
                    if (item.length == 0) {
                        return res.status(404).send("Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                if (req.body.owner != null) {
                    const item = yield this.itemModel.find({ owner: req.body.owner });
                    if (item.length == 0) {
                        return res.status(404).send("Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                else {
                    const item = yield this.itemModel.find();
                    return res.status(200).send(item);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).send(error.message);
            }
        });
    }
    ;
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by id");
            try {
                const item = yield this.itemModel.findById(req.params.id);
                if (item) {
                    res.status(200).send(item);
                }
                else {
                    res.status(404).send("Not Found");
                }
            }
            catch (error) {
                console.log(error);
                res.status(404).send(error.message);
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post");
            console.log(req.body);
            try {
                const item = yield this.itemModel.create(req.body);
                res.status(201).send(item);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
            }
        });
    }
    ;
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update by Id");
            let idItem, updated;
            try {
                if (req.query) {
                    idItem = req.params.id;
                    if (req.query.title) {
                        updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { title: req.query.title } }, { "returnDocument": "after" });
                    }
                    if (req.query.message) {
                        updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { message: req.query.message } }, { "returnDocument": "after" });
                    }
                    if (req.query.imageUrl) {
                        updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { imageUrl: req.query.imageUrl } }, { "returnDocument": "after" });
                    }
                }
                if (req.params) {
                    idItem = req.params.id;
                    if (req.body) {
                        if (req.body.age) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { age: req.body.age } }, { "returnDocument": "after" });
                        }
                        if (req.body.title) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { title: req.body.title } }, { returnDocument: "after" });
                        }
                        if (req.body.message) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { message: req.body.message } }, { returnDocument: "after" });
                        }
                        if (req.body.text) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { text: req.body.text } }, { returnDocument: "after" });
                        }
                        if (req.body.imageUrl) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { imageUrl: req.body.imageUrl } }, { returnDocument: "after" });
                        }
                        if (req.body.userAge) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { userAge: req.body.userAge } }, { "returnDocument": "after" });
                        }
                        if (req.body.userCountry) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { userCountry: req.body.userCountry } }, { "returnDocument": "after" });
                        }
                        if (req.body.userImageUrl) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { userImageUrl: req.body.userImageUrl } }, { "returnDocument": "after" });
                        }
                        if (req.body.postContent) {
                            console.log("Updating post content");
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { postText: req.body.postContent } }, { "returnDocument": "after" });
                        }
                        if (req.body.postImageUrl) {
                            console.log("Updating post image");
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { postImageUrl: req.body.postImageUrl } }, { "returnDocument": "after" });
                        }
                    }
                }
                if (updated) {
                    return res.status(200).send(updated);
                }
                else {
                    return res.status(400).send("Update Was Not Successful");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    ;
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.itemModel.deleteOne({ _id: req.params.id });
                if (result.deletedCount == 1)
                    return res.status(200).send("Delete Was Done");
                else
                    return res.status(404).send("Failed to delete");
            }
            catch (error) {
                console.log(error);
                res.status(404).send(error.message);
            }
        });
    }
}
;
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map