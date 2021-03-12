const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");


//environments config which will be hidden from the GitHub
dotenv.config();

//express setup
const app=express();

//Any Incoming requests will be parsed to the json
app.use(express.json());

//listen the app through 5000 port no
app.listen(5000,() => console.log("My FIrst node app"));


//set up routers
app.use("/snippet",require("./router/snippetRouter"));

//model username and passwords
//rakeshdeveloper 
//mongodb+srv://mongodbproject:b8vjKn1A0ZPaCXPT@cluster0.ebweg.mongodb.net/main?retryWrites=true&w=majority
mongoose.connect(process.env.MDB_CONNECT_STRING,
{
  useNewUrlParser:true,
  useUnifiedTopology:true

},(err)=>{
    if(err) return console.error(err);
    console.log("Connected to MongoDb");
});
