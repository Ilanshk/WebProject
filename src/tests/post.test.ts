import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import {Express} from "express";
import User from "../models/user_model";

let app: Express;

const testUser = {
    email:"post@gmail.com",
    password:"123456",
    accessToken:null
}
//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await Post.deleteMany();
    await User.deleteMany({email: testUser.email});
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;


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
        const res = await request(app)
            .get("/post")
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);

    });

    test("Create /post 1 and GET this post",async()=>{
        const res = await  request(app).post("/post")
            .set('Authorization','Bearer '+testUser.accessToken)
            .send(posts[0])
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[0].title);
        expect(res.body.message).toEqual(posts[0].message);
        let owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId1 = res.body._id;
        console.log("PostID1",postId1)

        const res2 = await request(app)
            .get("/post/"+postId1)
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body; //OBJECT IS RETURNED
        console.log(data);
        expect(data.title).toBe(posts[0].title);
        expect(data.message).toBe(posts[0].message);
        owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(data.owner)).toEqual(owner_id);
        
    })


    test("Create /post 2 and GET this post by id",async()=>{
        const res = await  request(app).post("/post")
            .set('Authorization','Bearer '+testUser.accessToken)
            .send(posts[1])
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual(posts[1].title);
        expect(res.body.message).toEqual(posts[1].message);
        let owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId2 = res.body._id;
        console.log("PostID2= ",postId2);

        const res2 = await request(app)
            .get("/post/" + postId2)
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.title).toBe(posts[1].title);
        expect(data.message).toBe(posts[1].message);
        owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(data.owner)).toEqual(owner_id);
        
    })


    test("GET /post/:id",async () =>{
        const resFirstPost = await request(app)
            .get("/post/" + postId1)
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(resFirstPost.statusCode).toBe(200);
        expect(resFirstPost.body.title).toBe(posts[0].title);
        expect(resFirstPost.body.message).toBe(posts[0].message);
        let postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(resFirstPost.body.owner)).toEqual(postOwner);

        const resSecondPost = await request(app)
            .get("/post/" + postId2)
            .set('Authorization','Bearer '+testUser.accessToken)
        expect(resSecondPost.statusCode).toBe(200);
        expect(resSecondPost.body.title).toBe(posts[1].title);
        expect(resSecondPost.body.message).toBe(posts[1].message);
        postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(resSecondPost.body.owner)).toEqual(postOwner);
    });

    test("Fail GET /post/:id",async() =>{
        const res = await request(app)
            .get("/post/00000")
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(res.statusCode).toBe(404);
    });


    test("GET all posts ",async () =>{
        const allPostsRes = await request(app)
            .get("/post")
            .set('Authorization','Bearer '+testUser.accessToken)
        expect(allPostsRes.statusCode).toBe(200);
        expect(allPostsRes.body[0].title).toBe(posts[0].title);
        expect(allPostsRes.body[0].message).toBe(posts[0].message);
        let postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(allPostsRes.body[0].owner)).toEqual(postOwner);
        expect(allPostsRes.body[1].title).toBe(posts[1].title);
        expect(allPostsRes.body[1].message).toBe(posts[1].message);
        expect(new mongoose.Types.ObjectId(allPostsRes.body[1].owner)).toEqual(postOwner);
    })

    test("GET post by title", async() =>{
        const resPost = await request(app)
            .get("/post")
            .query({title:posts[1].title}) //return array
            .set('Authorization','Bearer '+testUser.accessToken)
        expect(resPost.statusCode).toBe(200);
        console.log(resPost.body);
        
        expect(resPost.body[0].title).toBe(posts[1].title);
        expect(resPost.body[0].message).toBe(posts[1].message);
        const postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(resPost.body[0].owner)).toEqual(postOwner);
    })

    test("FAIL to get post by title", async() =>{
        const response = await request(app)
            .get("/post")
            .query({title:54490})
            .set('Authorization','Bearer '+testUser.accessToken);
        expect(response.statusCode).toBe(404);
    })


    test("PUT /post/:id",async()=>{
        const res = await request(app)
            .put("/post/"+postId1)
            .set('Authorization','Bearer '+testUser.accessToken)
            .send({title:"Updated Title"});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Updated Title");
        expect(res.body.message).toBe(posts[0].message);
        const postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(postOwner);
        
    })

    test("FAIL to PUT post document",async() =>{
        const res = await request(app)
            .put("/post/"+postId2)
            .set('Authorization','Bearer '+testUser.accessToken)
            .send({owner:1111});
        expect(res.statusCode).toBe(400);
    })

    test("DELETE post by its ID",async() =>{
        const res =await request(app)
            .delete("/post/"+postId2)
            .set('Authorization','Bearer '+testUser.accessToken)
        
        expect(res.statusCode).toBe(200);

        const resp = await request(app)
            .get("/post/"+postId2)
            .set('Authorization','Bearer '+testUser.accessToken)
        expect(resp.statusCode).toBe(404);
    })

    test(" FAIL to DELETE post by its ID",async() =>{
        const res =await request(app)
            .delete("/post/00000")
            .set('Authorization','Bearer '+testUser.accessToken)
        expect(res.statusCode).toBe(404);
    })

})