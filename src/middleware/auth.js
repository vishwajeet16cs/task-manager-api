const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async(req,res,next)=>{
    try{
        const tocken = req.header("Authorization").replace("Bearer ","")
        const decoded=jwt.verify(tocken,JWT_SECRET)
        // console.log(decoded)
        const user = await User.findOne({ _id:decoded._id,"tockens.tocken":tocken})
        // console.log(user)
        if(!user){
            throw new Error
        }
        req.tocken=tocken
        /* console.log("working ")
        console.log("here it is ",User.tockens) */
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:"Please authenticate."})
    }
}

module.exports=auth