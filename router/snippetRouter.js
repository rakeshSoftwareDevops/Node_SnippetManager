const router=require("express").Router();
const Snippet = require("../models/snippetModel");
const auth=require("../middleware/auth")


//auth data from the auth middleware function
router.get("/",auth,async(req,res)=>{
    console.log("is get snippet called");
    try{
        console.log("get snippet get called");
        console.log("just now"+req.user);
        const snippets=await Snippet.find({user:req.user});
        console.log("got snippets"+snippets);
        res.json(snippets);    

    }catch(err){
        res.status(500).send();
    }
});




//Get the test data from the router
router.get("/test",(req,res)=>{
    res.send("Router test2");
});

//Update the data from the model
router.put("/:id",auth,async(req,res)=>{
    try{
        const {title,description,code}=req.body;
        console.log("update snippets gets called");
        const snippetId=req.params.id;


        if(!snippetId){
            return res.status(400).json({errorMessage:"No Snippet with this ID was found. please contact the developer"});
        }

        if(!description && !code){
            return res.status(400).json({errorMessage:"You need code or description any one of them"})
        }
        
        const existingSnippet=await Snippet.findById(snippetId);

        if(!existingSnippet){
            return res.status(400).json({errorMessage:"There are no existing snippets for the input id"})
        }

        if(existingSnippet.user.toString()!==req.user){
            return res.status(401).json({errorMessage:"Unauthorized."});
        }
        existingSnippet.title=title;
        existingSnippet.description=description;
        existingSnippet.code=code;
        
        const savedsnippet=await existingSnippet.save();

        res.json(savedsnippet);

    }catch(err){
        console.log(error);
    }
})





//Delete the data from the model
router.delete("/:id",auth,async(req,res)=>{
    try{
        const snippetId=req.params.id;
        console.log("delete snippets gets called");
        if(!snippetId){
            return res.status(400).json({errorMessage:"Snippet is not given. plase connect to the developer."});
        }

        const existingsnippet=await Snippet.findById(snippetId);
        
        if(!existingsnippet){
            return res.status(400).json({errorMessage:"Snippet is not given. plase connect to the developer."});
            
        }

        if(existingsnippet.user.toString()!==req.user){
            return res.status(401).json({errorMessage:"Unauthorized."});
        }
        await existingsnippet.delete();
        res.json(existingsnippet);
    }catch(err){
        res.status(500).send();
    }
});



//Get the data from the model
/*router.get("/",auth,async (req,res)=>{
    try{

        const token=req.cookies.token;
        console.log(token);

        const snippets= await Snippet.find();
        res.json(snippets);
    }
    catch(err){
        res.status(500).send();
    }
   
});*/





//POST the data to the model
router.post("/",auth,async (req,res)=>{
    try{
        const {title,description,code}=req.body;
        console.log("posts snippets gets called");
        if(!description && !code){
            return res.status(400).json({errorMessage:"You need code or description any one of them"})
        }
        console.log("snippet adding request user"+req.user);
        const newSnippet=new Snippet({
            title,
            description,
            code,
            user:req.user
        })

        const savedsnippet=await newSnippet.save();

        res.json(savedsnippet);
    }
    catch(err){
        res.status(500).send();
    }
   
});

module.exports=router;