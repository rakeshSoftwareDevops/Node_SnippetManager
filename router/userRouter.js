const router=require("express").Router();
const User = require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

router.post("/",async (req,res)=>{
    try{

        const{email,password,passwordVerify}=req.body;
        console.log("login post called");
        //validation 
        if(!email || !password|| !passwordVerify){
            return res.status(400).json({errorMessage:"Emailid , password are mandatory fields."});
        }
    
        if(password.length<6){
            return res.status(400).json({
                errorMessage:"password length should not be less than 6 characters."
            });
        }
        
        if(password!==passwordVerify){
            return res.status(400).json({
                errorMessage:"please enter same password twice."
            });
        }
        
        //make sure no accounts is present with this emailid
        const existingUsers=await User.findOne({email});
        if(existingUsers){
            return res.status(400).json({
                errorMessage:"An account with this email already exists."
            });
        }

        //hash the password
        //generate the bcrypt salt
        const salt=await bcrypt.genSalt();

        //Generate the Hashed password by applying the salt to the password
        const passwordHash=await bcrypt.hash(password,salt);


        //create the new user with the above details and save in the mongodb

        const newUser=new User({
            email,
            passwordHash
        });

        //save the user data in the model
        const savedUser=await newUser.save();
        
        //create a jwt token and sign it with the secret key
        const token=jwt.sign(
        {
            id:savedUser._id
        },process.env.JWT_SECRET);

        //create a cookie for the generated token and send it to the frontend and make it hidden for the normal javascript
        res.cookie("token",token,{httpOnly:true}).send();
        
        //send the token to the frontend
        res.send(token);
        
        res.send(savedUser);
    
        //res.send("It works");

    }catch(err){
        res.status(500).send();
    } 
   
   
});

router.get("/loggedIn",async (req,res)=>{
    try{
      console.log("loggedin get called");

      const token=req.cookies.token;

      if(!token) return res.json(null);

      const validatedUser=jwt.verify(token, process.env.JWT_SECRET);
      res.json(validatedUser.id);


    }catch(err){
        res.status(500).send();
    } 
   
   
});

router.get("/logout",async (req,res)=>{
    try{
        console.log("loggedout get called");

        res.clearCookie("token").send();
    
    }catch(err){
        res.status(500).send();
    } 
   
   
});

router.post("/login",async (req,res)=>{
    try{

        const{email,password}=req.body;

        //validation 
        if(!email || !password){
            return res.status(400).json({errorMessage:"Emailid , password and passwordverify are mandatory fields."});
        }
        
        //make sure no accounts is present with this emailid
        const existingUsers=await User.findOne({email});
        if(!existingUsers){
            return res.status(400).json({
                errorMessage:"Wrong email or password."
            });
        }

        //returns true for correct password else returns false
        const correctPassword=await bcrypt.compare(
            password,
            existingUsers.passwordHash

        );

        if(!correctPassword){
            return res.status(401).json({
                errorMessage:"wrong email or password."
            })
        }
          

        //hash the password
        //generate the bcrypt salt
        const salt=await bcrypt.genSalt();

        //Generate the Hashed password by applying the salt to the password
        const passwordHash=await bcrypt.hash(password,salt);


        //create the new user with the above details and save in the mongodb

        const newUser=new User({
            email,
            passwordHash
        });

        //save the user data in the model
        const savedUser=await newUser.save();
        
        //create a jwt token and sign it with the secret key
        const token=jwt.sign(
        {
            id:savedUser._id
        },process.env.JWT_SECRET);

        //create a cookie for the generated token and send it to the frontend and make it hidden for the normal javascript
        res.cookie("token",token,{httpOnly:true}).send();
        
        //send the token to the frontend
        res.send(token);
        
        res.send(savedUser);
    
        //res.send("It works");

    }catch(err){
        res.status(500).send();
    } 
   
   
});



module.exports=router;