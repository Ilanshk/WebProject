import Post,{IPost} from "../models/post_model";
import BaseController from "./base_controller";

const postController = new BaseController<IPost>(Post);

export default postController;