const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require("./tasks")

const userSchema= new mongoose.Schema
({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password can't contain 'password' ")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error(" Age Must be an Positive no")
            }
        }
    },
    tockens:[{
        tocken:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer// to upload profile to db
    }
},{
   timestamps:true // by default it is false
})

userSchema.virtual("tasks",{
    ref:"Task",
    localField:"_id",
    foreignField:'owner'
})
 
userSchema.methods.toJSON=function(){
    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tockens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken=async function(){
    const user=this

    const tocken=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

     user.tockens= user.tockens.concat({tocken})
     await user.save()// for saving to db

    return tocken
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user= await User.findOne({email})
    // console.log("print user->",user)

    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error("Unable to login!")
    }

    return user
}

//Hase the plain text password before saving (midilware)
userSchema.pre("save",async function(next){
    const user=this// its refer to new data added

    console.log("just beffore saving!")

    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password,8)
        // console.log(user.password)
    }

    next()
})

//Delete user tasks when user is removed
userSchema.pre("remove",async function(next){
    const user = this 
    await Task.deleteMany({ owner: user._id})
    next()
})

const User=mongoose.model("User",userSchema)

module.exports=User