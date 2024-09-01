import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import {Express} from "express";
import User from "../models/user_model";

const user = {
    firstName: "userAuthFirst",
    lastName: "userAuthLast",
    email:"testAuth@gmail.com",
    password:"123456",
    userImageUrl : "http://http://192.168.56.1:3000/1715429550383",
    userAge:"20",
    userCountry:"Israel"
};

let app: Express;
let accessToken = "";
let refreshToken = "";

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit.initApp();
    console.log("beforeAll");
    await User.deleteMany({email:user.email})
    
});

afterAll(async ()=>{
    console.log("afterAll");
    appInit.server.close();
    await mongoose.connection.close();
});

describe("Auth test", () =>{
    test("Post /register" , async() =>{
        const res = await request(app).post("/auth/register").send({firstName:user.firstName,lastName:user.lastName,email:user.email,password:user.password,userImageUrl:user.userImageUrl,userAge:user.userAge,userCountry:user.userCountry});
        expect(res.statusCode).toBe(200);
    });

    test("Post /login" , async() =>{
        const res = await request(app).post("/auth/login").send({email:user.email,password:user.password});
        expect(res.statusCode).toBe(200);

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
    });


    const timeout = (ms:number) =>{
        return new Promise((resolve)=>{
            setTimeout(resolve,ms);
        })
    };

    jest.setTimeout(100000);

    test("refresh token", async()=>{

        const res = await request(app).post("/auth/login").send({email:user.email,password:user.password});
        expect(res.statusCode).toBe(200);
        //const accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken;

        const res2 = await request(app).get("/auth/refresh")
            .set('Authorization','Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).toBe(200);
        refreshToken = res2.body.refreshToken;
        accessToken = res2.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();


    })


    test("refresh token violation",async()=>{
        const res = await request(app).get("/auth/refresh")
            .set('Authorization','Bearer ' + refreshToken)
            .send();
        const oldRefreshToken = refreshToken;
        if(oldRefreshToken == res.body.refreshToken){
            console.log("refresh token is the same");
        }
        expect(res.statusCode).toBe(200);
        refreshToken = res.body.refreshToken;
        accessToken = res.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();

        const res1 = await request(app).get("/auth/refresh")
            .set('Authorization','Bearer ' + oldRefreshToken)
            .send();
        expect(res1.statusCode).not.toBe(200);

        const res2 = await request(app).get("/auth/refresh")
            .set('Authorization','Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).not.toBe(200);


    })

   
});


