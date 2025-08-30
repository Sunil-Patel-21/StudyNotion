import "dotenv/config";
import express from "express";

const app = express();

const port = process.env.PORT || 4000;

app.get("/",(req,res)=>{
    res.send("Home Page")
});

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
    
})