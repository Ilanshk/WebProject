import request from "supertest";
import appInit from"../App";
import mongoose from "mongoose";
import Item from"../models/item_model";
import {Express} from "express";

let app: Express;

//is called before tests are performed in this file
beforeAll(async()=>{
    app = await appInit();
    console.log("beforeAll");
    await Item.deleteMany();
});


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const items = [

    {
        text:"Item number 1"
    },
    {
        text:"Item number 2"
    },
];

describe("Item",()=>{
    let itemId1,itemId2;

    test("Get /Item - empty collection",async()=>{
        const res = await request(app).get("/item");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);

    });

    test("POST /item 1 and GET this item",async()=>{
        const res = await  request(app).post("/item").send(items[0])
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual(items[0].text);
        itemId1 = res.body._id;

        const res2 = await request(app).get("/item");
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data[0].text).toBe(items[0].text);
        
    })


    test("POST /item 2 and GET this item by id",async()=>{
        const res = await  request(app).post("/item").send(items[1])
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual(items[1].text);
        itemId2 = res.body._id;

        const res2 = await request(app).get("/item/" + itemId2);
        expect(res2.statusCode).toBe(200);
        const data = res2.body;
        expect(data.text).toBe(items[1].text);
        
    })


    test("GET /item/:id",async () =>{
        const resFirstItem = await request(app).get("/item/" +itemId1);
        expect(resFirstItem.statusCode).toBe(200);
        expect(resFirstItem.body.text).toBe(items[0].text);
        

        const resSecondItem = await request(app).get("/item/" + itemId2);
        expect(resSecondItem.statusCode).toBe(200);
        expect(resSecondItem.body.text).toBe(items[1].text);
    });

    test("Fail GET /item/:id",async() =>{
        const res = await request(app).get("/item/00000");
        expect(res.statusCode).toBe(404);
    });


    test("GET all items ",async () =>{
        const allItemsRes = await request(app).get("/item");
        expect(allItemsRes.statusCode).toBe(200);
        expect(allItemsRes.body[0].text).toBe(items[0].text);
        expect(allItemsRes.body[1].text).toBe(items[1].text);
    })

    test("GET item by text", async() =>{
        const resItem = await request(app).get("/item").query({text:items[0].text});
        expect(resItem.statusCode).toBe(200);
        expect(resItem.body[0].text).toBe(items[0].text);
       
    })

    test("FAIL to get item by text", async() =>{
        const response = await request(app).get("/item").query({text:"wwerrt"});
        expect(response.statusCode).toBe(404);
    })

    test("PUT /item/:id",async()=>{
        const res = await request(app).put("/item/"+itemId1).send({text:"New Text For Item 1"});
        expect(res.statusCode).toBe(200);
        expect(res.body.text).toBe("New Text For Item 1");
        
    })

    test("FAIL to PUT item document",async() =>{
        const res = await request(app).put("/item/"+itemId2).send({text:[11,22]});
        expect(res.statusCode).toBe(400);
    })

    test("DELETE item by its ID",async() =>{
        const res =await request(app).delete("/item/"+itemId1);
        expect(res.statusCode).toBe(200);

        const resp = await request(app).get("/item/"+itemId1);
        expect(resp.statusCode).toBe(404);
    })

    test(" FAIL to DELETE item by its ID",async() =>{
        const res =await request(app).delete("/item/E432");
        expect(res.statusCode).toBe(404);
    })

})