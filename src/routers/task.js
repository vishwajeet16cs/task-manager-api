const express =require("express")
const Task = require("../models/tasks")
const auth = require("../middleware/auth")
const router= new express.Router()

router.get("/taskcheck",(req,res)=>{
    res.send("from task check")
})

router.post("/tasks",auth,async(req,res)=>{
    // const task=new Task(req.body) 
    console.log("User Id",req.user._id)
    console.log("TAsk",req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    console.log(task)
        try{
            await task.save();
            res.status(201).send(task)
        }
        catch(e){
            res.status(400).send(e)
        }
})


//GET/tasks? completed =false
//GET/task?limit=10&skip=0----------limit skip
//GET /tasks?sortBY=createdAt_asc_de
router.get('/tasks',auth,async (req,res)=>{
    const match ={}
    const sort ={}
    if(req.query.completed){
        match.completed=req.query.completed==="true"// to make it boolian value
    }
    
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
       
        sort[parts[0]] = parts[1] === 'desc' ? -1 :1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }

        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get("/tasks/:id",auth,async (req,res)=>{
    const _id=req.params.id
    try{
        const task= await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.patch("/tasks/:id",auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["description","completed"]
    const invalidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })    
    

    if(!invalidOperation){
        return res.status(400).send({error:"Invalid updates!"})
    }

    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        // const task= await Task.findById(req.params.id)

        if(!task){
            return res.status(400).send()
        }
        
       updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        // console.log("task is here",task)
        
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete("/tasks/:id",auth,async (req,res)=>{
    // console.log(req.params.id)
    try{
        // const task =await Task.findByIdAndDelete(req.params.id)
        const task =await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

        if(!task){
            res.status(404).send({error:"no user found"})
        }
         res.send(task)
    }
    catch(e){
        res.status(500).send();
    }

})


module.exports= router