import express,{Express}from "express";
import mongoose from 'mongoose';
import request from 'supertest';
import fs from 'mz/fs';

jest.setTimeout(30000);
let app:Express;
describe("File Tests", ()=>{
    test("upload file",async () =>{
        const filePath = "C:\WebSystemsClass\sce_frontend\sce_frontend\assets\avatar.png";
        console.log(filePath);
        
        const rs = await fs.exists(filePath);
        if(rs){
             const response = await request(app)
                 .post("/file/file?file=123.jpeg").attach('file',filePath)
             expect(response.statusCode).toEqual(200);
        }
    })
})