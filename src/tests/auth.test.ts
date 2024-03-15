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
let accessToken = "";
let refreshToken = "";

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

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();

        //Here we add the authorization field to the request
        const res2 = await request(app).get("/student/").set('Authorization','Bearer ' + accessToken);
        expect(res2.statusCode).toBe(200);

        const fakeToken = accessToken + "0";
        const res3 = await request(app).get("/student/").set('Authorization','Bearer ' + fakeToken);
        expect(res3.statusCode).not.toBe(200);

    });


    const timeout = (ms:number) =>{
        return new Promise((resolve)=>{
            setTimeout(resolve,ms);
        })
    };

    jest.setTimeout(100000);

    test("refresh token", async()=>{

        const res = await request(app).post("/auth/login").send(user);
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

        const res3 = await request(app).get("/student")
            .set('Authorization','Bearer ' + accessToken);
        expect(res3.statusCode).toBe(200);

        //check token expiration - sleep 6 seconds and check if access token is expired
        await timeout(6000);
        const res4 = await request(app).get("/student")
            .set('Authorization','Bearer ' + accessToken);
        expect(res4.statusCode).not.toBe(200);
    })

    test("refresh token after expiration",async() =>{
         //check token expiration - sleep 6 seconds and check if access token is expired
         await timeout(6000);
         const res = await request(app).get("/student")
             .set('Authorization','Bearer ' + accessToken);
         expect(res.statusCode).not.toBe(200);

         const res1 = await request(app).get("/auth/refresh")
            .set('Authorization','Bearer ' + refreshToken)
            .send()
        expect(res1.statusCode).toBe(200);
        refreshToken = res1.body.refreshToken;
        accessToken = res1.body.accessToken;
        expect(refreshToken).not.toBeNull();
        expect(accessToken).not.toBeNull();

        const res2 = await request(app).get("/student")
             .set('Authorization','Bearer ' + accessToken);
         expect(res2.statusCode).toBe(200);
    
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


