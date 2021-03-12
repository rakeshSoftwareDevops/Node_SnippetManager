const router=require("express").Router();
const Snippet = require("../models/snippetModel");


//Get the test data from the router
router.get("/test",(req,res)=>{
    res.send("Router test2");
});

//Update the data from the model
router.put("/:id",async(req,res)=>{
    try{
        const {title,description,code}=req.body;

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
router.delete("/:id",async(req,res)=>{
    try{
        const snippetId=req.params.id;

        if(!snippetId){
            return res.status(400).json({errorMessage:"Snippet is not given. plase connect to the developer."});
        }

        const existingnippet=await Snippet.findById(snippetId);
        
        if(!existingnippet){
            return res.status(400).json({errorMessage:"Snippet is not given. plase connect to the developer."});
            
        }
        await existingnippet.delete();
        res.json(existingnippet);
    }catch(err){
        res.status(500).send();
    }
});



//Get the data from the model
router.get("/",async (req,res)=>{
    try{
        const snippets= await Snippet.find();
        res.json(snippets);
    }
    catch(err){
        res.status(500).send();
    }
   
});





//POST the data to the model
router.post("/",async (req,res)=>{
    try{
        const {title,description,code}=req.body;

        if(!description && !code){
            return res.status(400).json({errorMessage:"You need code or description any one of them"})
        }

        const newSnippet=new Snippet({
            title,description,code
        })

        const savedsnippet=await newSnippet.save();

        res.json(savedsnippet);
    }
    catch(err){
        res.status(500).send();
    }
   
});

module.exports=router;