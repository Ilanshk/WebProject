import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import {Express} from "express";

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await Post.deleteMany();
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const posts = [

    {
        title: "My First Post",
        message: "New Restaurant Opened",
        owner: "Ilan"
    },
    {
        title: "My Second Post",
        message: "Trip to Kineret",
        owner: "Ilan"
    },

];

describe("Post",()=>{
    let postId1,postId2;
    test("Get /Post - empty collection",async()=>{
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);

    });

    test("Create /post 1 and GET this post",async()=>{
        const res = await  request(app).post("/post").send(posts[0])
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[0].title);
        expect(res.body.message).toEqual(posts[0].message);
        expect(res.body.owner).toEqual(posts[0].owner);
        postId1 = res.body._id;
        console.log("PostID1",postId1)

        const res2 = await request(app).get("/post/"+postId1);
        expect(res2.statusCode).toBe(200);
        const data = res2.body; //OBJECT IS RETURNED
        console.log(data);
        expect(data.title).toBe(posts[0].title);
        expect(data.message).toBe(posts[0].message);
        expect(data.owner).toBe(posts[0].owner);
        
    })


    test("Create /post 2 and GET this post by id",async()=>{
        const res = await  request(app).post("/post").send(posts[1])
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[1].title);
        expect(res.body.message).toEqual(posts[1].message);
        expect(res.body.owner).toEqual(posts[1].owner);
        postId2 = res.body._id;
        console.log("PostID2= ",postId2);

        const res2 = await request(app).get("/post/" + postId2);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.title).toBe(posts[1].title);
        expect(data.message).toBe(posts[1].message);
        expect(data.owner).toBe(posts[1].owner);
        
    })


    test("GET /post/:id",async () =>{
        const resFirstPost = await request(app).get("/post/" + postId1);
        expect(resFirstPost.statusCode).toBe(200);
        expect(resFirstPost.body.title).toBe(posts[0].title);
        expect(resFirstPost.body.message).toBe(posts[0].message);
        expect(resFirstPost.body.owner).toBe(posts[0].owner);

        const resSecondPost = await request(app).get("/post/" + postId2);
        expect(resSecondPost.statusCode).toBe(200);
        expect(resSecondPost.body.title).toBe(posts[1].title);
        expect(resSecondPost.body.message).toBe(posts[1].message);
        expect(resSecondPost.body.owner).toBe(posts[1].owner);
    });

    test("Fail GET /post/:id",async() =>{
        const res = await request(app).get("/post/00000");
        expect(res.statusCode).toBe(404);
    });


    test("GET all posts ",async () =>{
        const allPostsRes = await request(app).get("/post");
        expect(allPostsRes.statusCode).toBe(200);
        expect(allPostsRes.body[0].title).toBe(posts[0].title);
        expect(allPostsRes.body[0].message).toBe(posts[0].message);
        expect(allPostsRes.body[0].owner).toBe(posts[0].owner);
        expect(allPostsRes.body[1].title).toBe(posts[1].title);
        expect(allPostsRes.body[1].message).toBe(posts[1].message);
        expect(allPostsRes.body[1].owner).toBe(posts[1].owner);
    })

    test("GET post by title", async() =>{
        const resPost = await request(app).get("/post").query({title:posts[1].title}); //return array
        expect(resPost.statusCode).toBe(200);
        console.log(resPost.body);
        
        expect(resPost.body[0].title).toBe(posts[1].title);
        expect(resPost.body[0].message).toBe(posts[1].message);
        expect(resPost.body[0].owner).toBe(posts[1].owner);
    })

    test("FAIL to get post by title", async() =>{
        const response = await request(app).get("/post").query({title:54490});
        expect(response.statusCode).toBe(404);
    })




    test("PUT /post/:id",async()=>{
        const res = await request(app).put("/post/"+postId1).send({title:"Updated Title"});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Updated Title");
        expect(res.body.message).toBe(posts[0].message);
        expect(res.body.owner).toBe(posts[0].owner);
        
    })

    test("FAIL to PUT post document",async() =>{
        const res = await request(app).put("/post/"+postId2).send({owner:1111});
        expect(res.statusCode).toBe(400);
    })

    test("DELETE post by its ID",async() =>{
        const res =await request(app).delete("/post/"+postId2);
        // console.log("TEST DELETE" , res);
        expect(res.statusCode).toBe(200);

        const resp = await request(app).get("/post/"+postId2);
        expect(resp.statusCode).toBe(404);
    })

    test(" FAIL to DELETE post by its ID",async() =>{
        const res =await request(app).delete("/post/00000");
        expect(res.statusCode).toBe(404);
    })
})