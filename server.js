import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRouter.js"
import cors from "cors";
// import cookieParser from "cookie-parser";
import errorHandler from "./utils/errorHandler.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const DB = process.env.MONGO; 

//MiddleWare
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : false}))
// app.use(cookieParser());
app.use(errorHandler);



//Route
app.use("/api/v1",authRoute);


app.use("/",(req,res)=>{
    res.json({message : "Hello welcome from NodeJs Auth-API"})
})


mongoose.connect(DB).then(()=>{
    console.log("DB_Connected");
}).catch((error)=>{
    console.log(error);
})

app.listen(port,(e)=>{
    if(e){
        console.log(e);
    }else{
        console.log(`Server on port ${port}`);
    }
})

