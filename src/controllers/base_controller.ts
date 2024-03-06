import {Request,Response} from "express";
import mongoose from "mongoose";


class BaseController<ModelType>{
  itemModel:mongoose.Model<ModelType>;
  constructor(itemModel:mongoose.Model<ModelType>){
    this.itemModel = itemModel;
  }

  async get(req:Request, res:Response){
    console.log("get");
    try{
      if(req.query.name != null){
        console.log("name");
        
        const item = await this.itemModel.find({name:req.query.name});
        if(item.length == 0){
          return res.status(404).send("Student Not Found");
        }
        else{
          return res.status(200).send(item);
        }
      }
      if(req.query.title != null){
        console.log("title");
        const item = await this.itemModel.find({title:req.query.title});
        if(item.length == 0){
          return res.status(404).send("Not Found");
        }
        else{
          return res.status(200).send(item);
        }
      }
      if(req.query.text != null){
        console.log("text");
        const item = await this.itemModel.find({text:req.query.text});
        if(item.length == 0){
          return res.status(404).send("Not Found");
        }
        else{
          return res.status(200).send(item);
        }
      }
      else{
        console.log("no filter");
        const item = await this.itemModel.find();
        console.log(item);
        console.log("Get empty collection");
        return res.status(200).send(item);
      }
      
    }catch(error){
      console.log(error);
      return res.status(400).send(error.message);
    }
  };

  async getById(req:Request, res:Response){
    console.log("get by id" );
    try{
      const item = await this.itemModel.findById(req.params.id);
      if(item){
        res.status(200).send(item);
      }
      else{
        res.status(404).send("Not Found")
      }
    }catch(error){
      console.log(error);
      res.status(404).send(error.message);

    }
    
  }
  
  async post(req:Request, res:Response){
    console.log("req.params = " + req.params[0])
    console.log("req.body = " + req.body[0])

    console.log("student post");
    try{
      const item = await this.itemModel.create(req.body);
      res.status(201).send(item);
    }catch(error){
      console.log(error);
      res.status(400).send(error.message)
    }
  };


  async put(req:Request, res:Response){
    console.log("student put by Id");
    let idItem,updated;
    try{
      if(req.query) {
        idItem= req.query.id;
        if(req.query.title){
          updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{title:req.query.title}},{"returnDocument":"after"});
        }
        if(req.query.message){
          updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{message:req.query.message}},{"returnDocument":"after"});
        }
      }
      if(req.params){
        idItem = req.params.id;
        if(req.body){
          //data = req.body;
          //idItem = data._id;
          if(req.body.age){
            updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{age:req.body.age}},{"returnDocument":"after"});
          }
          if(req.body.title){
            updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{title:req.body.title}},{returnDocument:"after"});
          }
          if(req.body.message){
            updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{message:req.body.message}},{returnDocument:"after"});
          }
          if(req.body.text){
            updated = await this.itemModel.findOneAndUpdate({_id:idItem},{$set:{text:req.body.text}},{returnDocument:"after"});
          }
        }
      }
      if(updated){
        return res.status(200).send(updated);
      }
      else{
        return res.status(400).send("Update Was Not Successful");
      }
    }catch(error){
      res.status(400).send(error.message)
    }
  };
  
  

  async remove(req:Request, res:Response){
    try{
      const result = await this.itemModel.deleteOne({_id:req.params.id});
      if(result.deletedCount == 1)
        return res.status(200).send("Delete Was Done");
      else
        return res.status(404).send("Failed to delete");
    }catch(error){
      console.log(error)
      res.status(404).send(error.message)
    }
  
  }
};
  
  export default BaseController;