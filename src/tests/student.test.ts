import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Student from"../models/student_model";
import {Express} from "express";
import User from "../models/user_model";

const testUser = {
    email: "teststudent@gmail.com",
    password:"123456",
    accessToken: null
}

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await Student.deleteMany();
    await User.deleteMany({email: testUser.email});
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const students = [

    {
        name:"John Doe",
        _id:"12345",
        imageUrl:"",
    },
    {
        name:"Jane Doe 2",
        _id:"12346",
        imageUrl:"",
    },

];

describe("Student",()=>{
    test("Get /Student - empty collection",async()=>{
        const res = await request(app).get("/student")
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);

    });

    test("POST /student 1 and GET this student",async()=>{
        const res = await  request(app).post("/student").send(students[0])
        .set('Authorization','Bearer '+testUser.accessToken)
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[0].name);
        expect(res.body.imageUrl).toEqual(students[0].imageUrl);
        expect(res.body._id).toEqual(students[0]._id);
        //studentId = res.body._id; //save the ID for later tests
        const res2 = await request(app).get("/student")
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data[0].name).toBe(students[0].name);
        expect(data[0]._id).toBe(students[0]._id);
        expect(data[0].imageUrl).toBe(students[0].imageUrl);
        
    })


    test("POST /student 2 and GET this student by id",async()=>{
        const res = await  request(app).post("/student").send(students[1])
        .set('Authorization','Bearer '+testUser.accessToken)
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[1].name);
        expect(res.body.imageUrl).toEqual(students[1].imageUrl);
        expect(res.body._id).toEqual(students[1]._id);

        //studentId = res.body._id; //save the ID for later tests
        const res2 = await request(app).get("/student/" + students[1]._id)
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.name).toBe(students[1].name);
        expect(data._id).toBe(students[1]._id);
        expect(data.imageUrl).toBe(students[1].imageUrl);
        
    })


    test("GET /student/:id",async () =>{
        const resFirstStudent = await request(app).get("/student/" + students[0]._id)
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(resFirstStudent.statusCode).toBe(200);
        expect(resFirstStudent.body.name).toBe(students[0].name);
        expect(resFirstStudent.body._id).toBe(students[0]._id);
        expect(resFirstStudent.body.imageUrl).toBe(students[0].imageUrl);

        const resSecondStudent = await request(app).get("/student/" + students[1]._id)
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(resSecondStudent.statusCode).toBe(200);
        expect(resSecondStudent.body.name).toBe(students[1].name);
        expect(resSecondStudent.body._id).toBe(students[1]._id);
        expect(resSecondStudent.body.imageUrl).toBe(students[1].imageUrl);
    });

    test("Fail GET /student/:id",async() =>{
        const res = await request(app).get("/student/00000")
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(404);
    });


    test("GET all students ",async () =>{
        const allStudentsRes = await request(app).get("/student")
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(allStudentsRes.statusCode).toBe(200);
        expect(allStudentsRes.body[0].name).toBe(students[0].name);
        expect(allStudentsRes.body[0].imageUrl).toBe(students[0].imageUrl);
        expect(allStudentsRes.body[0]._id).toBe(students[0]._id);
        expect(allStudentsRes.body[1].name).toBe(students[1].name);
        expect(allStudentsRes.body[1].imageUrl).toBe(students[1].imageUrl);
        expect(allStudentsRes.body[1]._id).toBe(students[1]._id);
    })

    test("GET student by name", async() =>{
        const resStudent = await request(app).get("/student").query({name:"Jane Doe 2"})
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(resStudent.statusCode).toBe(200);
        expect(resStudent.body[0].name).toBe(students[1].name);
        expect(resStudent.body[0].imageUrl).toBe(students[1].imageUrl);
        expect(resStudent.body[0]._id).toBe(students[1]._id);
    })

    test("FAIL to get student by name", async() =>{
        const response = await request(app).get("/student").query({name:"abc"})
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(response.statusCode).toBe(404);
    })

    test("PUT /student/:id",async()=>{
        const res = await request(app).put("/student/"+students[1]._id).send({imageUrl:"url"})
        .set('Authorization','Bearer '+testUser.accessToken);
        console.log("Tets PUT /student/:id"+ res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(students[1]._id);
        expect(res.body.name).toBe(students[1].name);
        expect(res.body.imageUrl).toBe("url");
        
    })

    test("FAIL to PUT student document",async() =>{
        const res = await request(app).put("/student/"+students[1]._id).send({imageUrl:{id:80}})
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(400);
    })

    test("DELETE student by its ID",async() =>{
        const res =await request(app).delete("/student/"+students[0]._id)
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(200);

        const resp = await request(app).get("/student/"+students[0]._id)
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(resp.statusCode).toBe(404);
    })

    test(" FAIL to DELETE student by its ID",async() =>{
        const res =await request(app).delete("/student/788900")
        .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(404);
    })    
})