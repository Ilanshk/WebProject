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
                    const item = yield this.itemModel.find({ name: req.query.name });
                    if (item.length == 0) {
                        return res.status(404).send("Student Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                if (req.query.title != null) {
                    const item = yield this.itemModel.find({ title: req.query.title });
                    if (item.length == 0) {
                        return res.status(404).send("Not Found");
                    }
                    else {
                        return res.status(200).send(item);
                    }
                }
                else {
                    const item = yield this.itemModel.find();
                    console.log("Get empty collection");
                    return res.status(200).send(item);
                }
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
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
            console.log("req.params = " + req.params[0]);
            console.log("req.body = " + req.body[0]);
            console.log("student post");
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
            console.log("student put by Id");
            let idItem, updated;
            try {
                if (req.query) {
                    idItem = req.query.id;
                    if (req.query.title) {
                        updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { title: req.query.title } }, { "returnDocument": "after" });
                    }
                    if (req.query.message) {
                        updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { message: req.query.message } }, { "returnDocument": "after" });
                    }
                }
                if (req.params) {
                    idItem = req.params.id;
                    if (req.body) {
                        //data = req.body;
                        //idItem = data._id;
                        if (req.body.age) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { age: req.body.age } }, { "returnDocument": "after" });
                        }
                        if (req.body.title) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { title: req.body.title } }, { returnDocument: "after" });
                        }
                        if (req.body.message) {
                            updated = yield this.itemModel.findOneAndUpdate({ _id: idItem }, { $set: { message: req.body.message } }, { returnDocument: "after" });
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
            //res.send("student delete by id");
        });
    }
}
;
//export default { getStudents,getStudentById, postStudents,putStudentById,deleteStudentById };
// export default baseController;
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map