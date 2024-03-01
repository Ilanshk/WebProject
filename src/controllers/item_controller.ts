import Item, {Iitem} from "../models/item_model";
import BaseController from "./base_controller";

const ItemController = new BaseController<Iitem>(Item)

export default ItemController;


