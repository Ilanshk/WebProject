import appInit from "./App";

appInit().then((app)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Example app listening on port ${process.env.PORT}!`);
    });
})