import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Student from"../models/student_model";
import {Express} from "express";
import User from "../models/user_model";

const testUser = {
    firstName:"testFirstStudent",
    lastName: "testLastStudent",
    email:"userTest@gmail.com",
    password:"1234567",
    userImageUrl:"http://192.168.56.1:3000/1715429550383",
    userAge:"20",
    userCountry:"Israel"
}
let refreshToken = '';
let testUserId = '';

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await User.deleteMany({email: testUser.email});
    await request(app).post("/auth/register").send({firstName:testUser.firstName,lastName:testUser.lastName,email:testUser.email,password:testUser.password,userImageUrl:testUser.userImageUrl,userAge:testUser.userAge,userCountry:testUser.userCountry});
    const res = await request(app).post("/auth/login").send({email:testUser.email,password:testUser.password});
    testUserId = res.body.userId
    refreshToken = res.body.refreshToken;
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});



describe("User",()=>{
    
    test("GET /user/:id",async () =>{
        const resFirstStudent = await request(app).get("/user/" + testUserId)
        .set('Authorization','Bearer '+refreshToken);
        expect(resFirstStudent.statusCode).toBe(200);
        expect(resFirstStudent.body.firstName).toBe(testUser.firstName);
        expect(resFirstStudent.body.lastName).toBe(testUser.lastName);
        expect(resFirstStudent.body.email).toBe(testUser.email);
        expect(resFirstStudent.body.userImageUrl).toBe(testUser.userImageUrl);
        expect(resFirstStudent.body.userAge).toBe(testUser.userAge);
        expect(resFirstStudent.body.userCountry).toBe(testUser.userCountry);

    });

    test("Fail GET /user/:id",async() =>{
        const res = await request(app).get("/user/00000")
        .set('Authorization','Bearer '+refreshToken);
        expect(res.statusCode).toBe(404);
    });
    

    test("PUT /user/:id",async()=>{
        const res = await request(app).put("/user/"+testUserId).send({userImageUrl:"url"})
        .set('Authorization','Bearer '+refreshToken);
        const userImageUrl = (await User.findOne({email:testUser.email})).userImageUrl
        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe(testUser.firstName);
        expect(res.body.lastName).toBe(testUser.lastName);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.userImageUrl).toBe(userImageUrl);
        expect(res.body.userAge).toBe(testUser.userAge);
        expect(res.body.userCountry).toBe(testUser.userCountry);
        
    })

    test("FAIL to PUT user document",async() =>{
        const res = await request(app).put("/user/"+testUserId).send({userImageUrl:{id:80}})
        .set('Authorization','Bearer '+refreshToken);
        expect(res.statusCode).toBe(400);
    })
})