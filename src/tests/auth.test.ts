import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import {Express} from "express";
import User from "../models/user_model";

const user = {
    email:"test@gmail.com",
    password:"123456"
};

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await User.deleteMany({email:user.email})
    
});

afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

describe("Auth test", () =>{
    test("Post /register" , async() =>{
        const res = await request(app).post("/auth/register").send(user);
        expect(res.statusCode).toBe(200);
    });

    test("Post /login" , async() =>{
        const res = await request(app).post("/auth/login").send(user);
        expect(res.statusCode).toBe(200);

        const accessToken = res.body.accessToken;
        console.log(accessToken);
        
        expect(accessToken).not.toBeNull();
        //Here we add the authorization field to the request
        const res2 = await request(app).get("/student/").set('Authorization','Bearer ' + accessToken);
        expect(res2.statusCode).toBe(200);

        const fakeToken = accessToken + "0";
        const res3 = await request(app).get("/student/").set('Authorization','Bearer ' + fakeToken);
        expect(res3.statusCode).not.toBe(200);

    });

   
});


