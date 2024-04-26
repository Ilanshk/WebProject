import appInit from "./App";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";


appInit().then((app)=>{
    if(process.env.NODE_ENV == "development"){
        const options = {
            definition:{
                openapi: "3.0.0",
                info:{
                    title:"SCE Web Application Backend API",
                    version:"1.0.0",
                    description:"Application based on REST API with users and students including authentication.Posts and Items can be created and modified"
                },
                servers:[
                    {
                        url:"http://localhost:"+process.env.PORT
                    }
                ],
            },
            apis:[
                "./src/routes/*.ts"
            ]
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs));

    }
    
    app.listen(process.env.PORT,()=>{
        console.log(`Example app listening on port ${process.env.PORT}!`);
    });
})