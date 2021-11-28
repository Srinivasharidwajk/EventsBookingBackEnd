import  express from 'express';
import dotEnv from 'dotenv';
import * as process from "process";
import cors from 'cors';
import mongoose from "mongoose";
import userRouter from "./router/userRouter";
import eventsRouter from "./router/eventsRouter";
const app:express.Application = express();

//configure ==cors
app.use(cors());

// configure dotEnv
dotEnv.config({
    path:'./.env'
});

// configure ExpressJS to Receive FormData
app.use(express.json());


const hostname:string | undefined = process.env.HOST_NAME;
const port:number | undefined = Number(process.env.PORT);
// connect to Mongodb
let dbURL:string | undefined = process.env.MONGO_DB_LOCAL
if(dbURL){
    mongoose.connect(dbURL,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false
    }).then((response) => {
console.log('Connect to MongoDB Successfully........')
    }).catch((error) => {
console.error(error);
process.exit(1);// stop NodeJS Process
    });
}

app.get('/',(request:express.Request,response:express.Response) => {
    response.status(200).send(`<h2>Welcome to Events Booking Server app</h2>`);

});
app.use('/users',userRouter);
app.use('/events',eventsRouter);

if(port && hostname){
    app.listen(port,hostname,()=>{
       console.log(`Express Server is Started at http://${hostname}:${port}`);
    });
}