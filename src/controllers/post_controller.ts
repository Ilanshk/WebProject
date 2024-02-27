import Post,{IPost} from "../models/post_model";
import {Request,Response} from "express";
import BaseController from "./base_controller";

const postController = new BaseController<IPost>(Post);

export default postController;