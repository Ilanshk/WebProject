import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Student from"../models/student_model";
import {Express} from "express";

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await Student.deleteMany();
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const students = [

    {
        name:"John Doe",
        _id:"12345",
        age:22,
    },
    {
        name:"Jane Doe 2",
        _id:"12346",
        age:23,
    },

];

describe("Student",()=>{
    test("Get /Student - empty collection",async()=>{
        const res = await request(app).get("/student");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);

    });

    test("POST /student 1 and GET this student",async()=>{
        const res = await  request(app).post("/student").send(students[0])
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[0].name);
        expect(res.body.age).toEqual(students[0].age);
        expect(res.body._id).toEqual(students[0]._id);
        //studentId = res.body._id; //save the ID for later tests
        const res2 = await request(app).get("/student");
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data[0].name).toBe(students[0].name);
        expect(data[0]._id).toBe(students[0]._id);
        expect(data[0].age).toBe(students[0].age);
        
    })


    test("POST /student 2 and GET this student by id",async()=>{
        const res = await  request(app).post("/student").send(students[1])
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(students[1].name);
        expect(res.body.age).toEqual(students[1].age);
        expect(res.body._id).toEqual(students[1]._id);

        //studentId = res.body._id; //save the ID for later tests
        const res2 = await request(app).get("/student/" + students[1]._id);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.name).toBe(students[1].name);
        expect(data._id).toBe(students[1]._id);
        expect(data.age).toBe(students[1].age);
        
    })


    test("GET /student/:id",async () =>{
        const resFirstStudent = await request(app).get("/student/" + students[0]._id);
        expect(resFirstStudent.statusCode).toBe(200);
        expect(resFirstStudent.body.name).toBe(students[0].name);
        expect(resFirstStudent.body._id).toBe(students[0]._id);
        expect(resFirstStudent.body.age).toBe(students[0].age);

        const resSecondStudent = await request(app).get("/student/" + students[1]._id);
        expect(resSecondStudent.statusCode).toBe(200);
        expect(resSecondStudent.body.name).toBe(students[1].name);
        expect(resSecondStudent.body._id).toBe(students[1]._id);
        expect(resSecondStudent.body.age).toBe(students[1].age);
    });

    test("Fail GET /student/:id",async() =>{
        const res = await request(app).get("/student/00000");
        expect(res.statusCode).toBe(404);
    });


    test("GET all students ",async () =>{
        const allStudentsRes = await request(app).get("/student");
        expect(allStudentsRes.statusCode).toBe(200);
        expect(allStudentsRes.body[0].name).toBe(students[0].name);
        expect(allStudentsRes.body[0].age).toBe(students[0].age);
        expect(allStudentsRes.body[0]._id).toBe(students[0]._id);
        expect(allStudentsRes.body[1].name).toBe(students[1].name);
        expect(allStudentsRes.body[1].age).toBe(students[1].age);
        expect(allStudentsRes.body[1]._id).toBe(students[1]._id);
    })

    test("GET student by name", async() =>{
        const resStudent = await request(app).get("/student").query({name:"Jane Doe 2"});
        expect(resStudent.statusCode).toBe(200);
        expect(resStudent.body[0].name).toBe(students[1].name);
        expect(resStudent.body[0].age).toBe(students[1].age);
        expect(resStudent.body[0]._id).toBe(students[1]._id);
    })

    test("FAIL to get student by name", async() =>{
        const response = await request(app).get("/student").query({name:"abc"});
        expect(response.statusCode).toBe(404);
    })

    test("PUT /student/:id",async()=>{
        const res = await request(app).put("/student/"+students[1]._id).send({age:25});
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(students[1]._id);
        expect(res.body.name).toBe(students[1].name);
        expect(res.body.age).toBe(25);
        
    })

    test("FAIL to PUT student document",async() =>{
        const res = await request(app).put("/student/"+students[1]._id).send({age:"AAAA"});
        expect(res.statusCode).toBe(400);
    })

    test("DELETE student by its ID",async() =>{
        const res =await request(app).delete("/student/"+students[0]._id);
        expect(res.statusCode).toBe(200);

        const resp = await request(app).get("/student/"+students[0]._id);
        expect(resp.statusCode).toBe(404);
    })

    test(" FAIL to DELETE student by its ID",async() =>{
        const res =await request(app).delete("/student/788900");
        expect(res.statusCode).toBe(404);
    })

    

    // test("DELETE /student/:id",async () =>{
    //     const res = await request(app).delete("/student/" + students[0]._id);
    //     expect(res.statusCode).toBe(200);

    //     const res2 = await request(app).get("/student/"+students[0]._id);
    //     expect(res2.statusCode).toBe(404);
    // });

    
})