const express= require("express");
const multer= require('multer')
const sharp =require("sharp")
const User=require("../models/user")
const auth = require("../middleware/auth")
const {sendWelcomeEmail,sendCancelationEmail} = require("../emails/account")
const router = new express.Router()


router.post('/users',async(req,res)=>{
    const user= new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
   
        const tocken = await user.generateAuthToken()
    
        res.status(201).send({user,tocken})
    }
    catch(e){
        res.status(400).send(e)
    }
    // res.send("send is working")

})

router.post("/users/login",async (req,res)=>{
    // console.log("Request come from login")
    try{
        // will find the user if match else not
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const tocken = await user.generateAuthToken()
        res.send({user:user,tocken})
    }
    catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    console.log("log out is working")
    try{
        req.user.tockens=req.user.tockens.filter((tocken)=>{
            return tocken.tocken!==req.tocken
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post("/users/logoutAll",auth,async(req,res)=>{
    // res.send("logoutall")
    try{
        req.user.tockens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.get('/users/me',auth,async(req,res)=>{
    console.log(req.user)
    console.log("inside users")
    res.send(req.user)
})



//Update The existing Resource
router.patch("/users/me",auth,async (req,res)=>{
    // console.log(req.user)
    const updates = Object.keys(req.body)// conver obj - array(array contain only key of string)
    const allowedUpdates=['name','email','password','age']// only thing we can update
    const isValidOperation = updates.every((update)=>{// return true and false
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid update!"})
    }

    try{

        updates.forEach((update)=>{
            req.user[updates] = req.body[update]
        })

        await req.user.save()//including midilware
        
        res.send(req.user)
        
    }catch(e){
          res.status(400).send(e)
    }
})


router.delete("/users/me",auth,async (req,res)=>{
    // console.log("inside delete")
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)//send deleated data as response
    }catch(e){
        res.status(500).send(e )
    }
})


const upload=multer({
    // dest:"avatars",
    limits:{
        fileSize:1000000
    },
    fileFilter(res,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("plzz.. uplode pic only"))
        }
        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,upload.single("avatar"),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({ width:250 ,height:250}).png().toBuffer()
    req.user.avatar= buffer// storing data to db (model)
    
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",auth,async(req,res)=>{
        // await req.user.avatar.remove()
        req.user.avatar=undefined
        await req.user.save()
        res.send()
   

})

router.get("/users/:id/avatar",async(req,res)=>{
    try{
        const user =  await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set("Content-Type","image/png")
        res.send(user.avatar)

    }catch(e){
        res.status(400).send()
    }
})

module.exports=router