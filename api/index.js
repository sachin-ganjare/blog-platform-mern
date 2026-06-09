import express from 'express';
import mongoose from  'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO)
                .then(()=>{
                    console.log("MongoDB is connected!");
                });

app.listen( port, ()=>{
    console.log("server is listening on port: "+ port);
})