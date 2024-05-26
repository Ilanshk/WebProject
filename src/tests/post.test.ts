import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import {Express} from "express";
import User from "../models/user_model";

let app: Express;

const testUser = {
    firstName:"testFirst",
    lastName: "testLast",
    email:"postTest@gmail.com",
    password:"1234567",
    userImageUrl:"http://192.168.56.1:3000/1715429550383",
    userAge:"20",
    userCountry:"Israel"

}
let refreshToken = '';
//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
   await Post.deleteMany({_id:1456227});
   await User.deleteMany({email: testUser.email});
    await request(app).post("/auth/register").send({firstName:testUser.firstName,lastName:testUser.lastName,email:testUser.email,password:testUser.password,userImageUrl:testUser.userImageUrl,userAge:testUser.userAge,userCountry:testUser.userCountry});
    const res = await request(app).post("/auth/login").send({email:testUser.email,password:testUser.password});
    refreshToken = res.body.refreshToken;
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const posts = [

    {
        _id: 1456227,
        postText: "post 1 text",
        owner: "Ilan",
        postImageUrl: "http://localhost:192.168.56.1:3000/647677368i7874397.jpg"
    },
    {
        _id: 1798438,
        postText: "post 2 text",
        owner: "Sagiv",
        postImageUrl: "http://localhost:192.168.56.1:3000/647677368i9074651.jpg"
    },

];

describe("Post",()=>{
    let postId1,postId2;
    

    test("Create /post 1 and GET this post",async()=>{
        const res = await  request(app).post("/post")
            .set('Authorization','Bearer '+ refreshToken)
            .send(posts[0])
        
        expect(res.statusCode).toEqual(201);
        expect(res.body._id).toEqual(posts[0]._id);
        expect(res.body.postText).toEqual(posts[0].postText);
        expect(res.body.postImageUrl).toEqual(posts[0].postImageUrl);
        let owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId1 = res.body._id;
        console.log("PostID1",postId1)

        const res2 = await request(app)
            .get("/post/"+postId1)
            .set('Authorization','Bearer '+refreshToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body; //OBJECT IS RETURNED
        console.log(data);
        expect(data._id).toBe(posts[0]._id);
        expect(data.postText).toBe(posts[0].postText);
        expect(data.postImageUrl).toBe(posts[0].postImageUrl);
        owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(data.owner)).toEqual(owner_id);
        
    })


    test("Create /post 2 and GET this post by id",async()=>{
        const res = await  request(app).post("/post")
            .set('Authorization','Bearer '+ refreshToken)
            .send(posts[1])
        expect(res.statusCode).toEqual(201);
        expect(res.body._id).toEqual(posts[1]._id);
        expect(res.body.postText).toEqual(posts[1].postText);
        expect(res.body.postImageUrl).toEqual(posts[1].postImageUrl);
        let owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(owner_id);
        postId2 = res.body._id;
        console.log("PostID2= ",postId2);

        const res2 = await request(app)
            .get("/post/" + postId2)
            .set('Authorization','Bearer '+refreshToken);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data._id).toBe(posts[1]._id);
        expect(data.postText).toBe(posts[1].postText);
        expect(data.postImageUrl).toBe(posts[1].postImageUrl);
        owner_id = (await(User.findOne({email:testUser.email})))._id
        expect(new mongoose.Types.ObjectId(data.owner)).toEqual(owner_id);
        
    })


    test("GET /post/:id",async () =>{
        const resFirstPost = await request(app)
            .get("/post/" + postId1)
            .set('Authorization','Bearer '+refreshToken);
        expect(resFirstPost.statusCode).toBe(200);
        expect(resFirstPost.body._id).toBe(posts[0]._id);
        expect(resFirstPost.body.postText).toBe(posts[0].postText);
        expect(resFirstPost.body.postImageUrl).toBe(posts[0].postImageUrl);
        let postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(resFirstPost.body.owner)).toEqual(postOwner);

        const resSecondPost = await request(app)
            .get("/post/" + postId2)
            .set('Authorization','Bearer '+refreshToken)
        expect(resSecondPost.statusCode).toBe(200);
        expect(resSecondPost.body._id).toBe(posts[1]._id);
        expect(resSecondPost.body.postText).toBe(posts[1].postText);
        expect(resSecondPost.body.postImageUrl).toBe(posts[1].postImageUrl);
        postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(resSecondPost.body.owner)).toEqual(postOwner);
    });

    test("Fail GET /post/:id",async() =>{
        const res = await request(app)
            .get("/post/00000")
            .set('Authorization','Bearer '+refreshToken);
        expect(res.statusCode).toBe(404);
    });


    test("GET all posts ",async () =>{
        const allPostsRes = await request(app)
            .get("/post")
            .set('Authorization','Bearer '+refreshToken)
        expect(allPostsRes.statusCode).toBe(200);
        const allPostsForTests = allPostsRes.body.filter((post) => post._id ==1456227 || post._id ==1798438)
        expect(allPostsForTests[0]._id).toBe(posts[0]._id);
        expect(allPostsForTests[0].postText).toBe(posts[0].postText);
        expect(allPostsForTests[0].postImageUrl).toBe(posts[0].postImageUrl);
        let postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(allPostsForTests[0].owner)).toEqual(postOwner);
        expect(allPostsForTests[1]._id).toBe(posts[1]._id);
        expect(allPostsForTests[1].postText).toBe(posts[1].postText);
        expect(allPostsForTests[1].postImageUrl).toBe(posts[1].postImageUrl);
        expect(new mongoose.Types.ObjectId(allPostsForTests[1].owner)).toEqual(postOwner);
    })

    test("GET post by owner", async() =>{
        const ownerId = (await User.findOne({email:testUser.email}))._id;
        console.log("owner id: "+ownerId);
        

        const resPost = await request(app)
            .get("/post")
            .query({owner:ownerId}) //return array
            .set('Authorization','Bearer '+refreshToken)
        expect(resPost.statusCode).toBe(200);
        console.log(resPost.body);
        const filteredPosts = resPost.body.filter((post) => post.owner == ownerId)
        
        expect(filteredPosts[0]._id).toBe(posts[0]._id);
        expect(filteredPosts[0].postText).toBe(posts[0].postText);
        expect(filteredPosts[0].postImageUrl).toBe(posts[0].postImageUrl);
        expect(new mongoose.Types.ObjectId(filteredPosts[0].owner)).toEqual(ownerId);
    })

    test("FAIL to get post by owner", async() =>{
        const response = await request(app)
            .get("/post")
            .query({title:{name:'abc'}})
            .set('Authorization','Bearer '+refreshToken);
        expect(response.statusCode).toBe(404);
    })


    test("PUT /post/:id",async()=>{
        const res = await request(app)
            .put("/post/"+postId1)
            .set('Authorization','Bearer '+refreshToken)
            .send({postContent:"Updated text for post 1"});
        expect(res.statusCode).toBe(200);
        expect(res.body.postText).toBe("Updated text for post 1");
        expect(res.body._id).toBe(posts[0]._id);
        expect(res.body.postImageUrl).toBe(posts[0].postImageUrl);
        const postOwner = (await User.findOne({email:testUser.email}))._id;
        expect(new mongoose.Types.ObjectId(res.body.owner)).toEqual(postOwner);
        
    })

    test("FAIL to PUT post document",async() =>{
        const res = await request(app)
            .put("/post/"+postId2)
            .set('Authorization','Bearer '+refreshToken)
            .send({owner:{count:10}});
        expect(res.statusCode).toBe(400);
    })

    test("DELETE post by its ID",async() =>{
        const res1 =await request(app)
            .delete("/post/"+postId2)
            .set('Authorization','Bearer '+refreshToken)
        
        expect(res1.statusCode).toBe(200);

        const resp = await request(app)
            .get("/post/"+postId2)
            .set('Authorization','Bearer '+refreshToken)
        expect(resp.statusCode).toBe(404);

        const res2 =await request(app)
            .delete("/post/"+postId1)
            .set('Authorization','Bearer '+refreshToken);
        expect(res1.statusCode).toBe(200);

        const resp2 = await request(app)
            .get("/post/"+postId1)
            .set('Authorization','Bearer '+refreshToken)
        expect(resp2.statusCode).toBe(404);


    })

    test(" FAIL to DELETE post by its ID",async() =>{
        const res =await request(app)
            .delete("/post/00000")
            .set('Authorization','Bearer '+refreshToken)
        expect(res.statusCode).toBe(404);
    })

})