import mongoose from "mongoose";
import Item from "../models/item_model";
import {Request,Response} from "express";


const getAllItems = async (req:Request,res:Response) =>{
    console.log("Get All Items");
    let item;
    try{
            if(req.query.text){
                item = await Item.find({text:req.query.text});
                if(item.length == 0)
                    return res.status(404).send("Item Not Found");
                else
                    return res.status(200).send(item);   
            }
            
           
            else{
                item = await Item.find();
                return res.status(200).send(item);
            }
    }catch(error){
        res.status(404).send(error.message);
    }

};

const getItemById = async(req:Request,res:Response) =>{
    let item;
    try{
        item = await Item.findById(new mongoose.Types.ObjectId(req.params.id));
        if(item)
            res.status(200).send(item);
        else
            res.status(404).send("Item Not Found");
    }catch(error){
        res.status(404).send(error.message);
    }
}

const createItem = async(req:Request,res:Response) =>{
    console.log("Create New Item");
    let newItem;
    try{
        newItem = await Item.create(req.body);
        res.status(201).send(newItem);
    }catch(error){
        res.status(400).send(error.message);
    }
};

const updateItem = async(req:Request,res:Response) => {
    console.log("Update Item");
    let updatedItem;
    try{
        if(req.params.id){
            if(req.body.text){
                updatedItem = await Item.findOneAndUpdate({_id:new mongoose.Types.ObjectId(req.params.id)},
                {$set:{text:req.body.text}},{returnDocument:"after"})
            }
        }
        if(req.query.id){
            const item = await Item.find({text:req.query.id});
            console.log("ITEM TO FIND",item);
            
            if(item && req.query.text)
                updatedItem = await Item.findOneAndUpdate({_id:item[0]._id},{$set:{text:req.query.text}},{returnDocument:"after"});
        }
        if(updatedItem){
            console.log("UPDATED ITEM",updatedItem);
            return res.status(200).send(updatedItem);
        }
        else
            return res.status(400).send("Item Update Failed");
    }catch(error){
        res.status(400).send(error.message);
    }
};

const deleteItem = async(req:Request,res:Response) => {
    console.log("Delete Item");
    try{
        if(req.params.id){
            const resultOfDelete = await Item.deleteOne({_id:new mongoose.Types.ObjectId(req.params.id)});
            if(resultOfDelete.deletedCount == 1){
                return res.status(200).send("Successful delete");
            }
            else
                return res.status(404).send("Item was not Found")

        }
    }catch(error){
        res.status(400).send(error.message);
    }
}

export default {getAllItems,getItemById,createItem,updateItem,deleteItem};