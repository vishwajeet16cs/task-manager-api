const mongoose= require('mongoose')


const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
     },
     completed:{
         type:Boolean,
         default:false
     },
     owner:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:"User"
     }
},{
    timestamps:true
})

const Task=mongoose.model("Task",taskSchema)

module.exports=Task



/* 
    const mongoose= require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
     },
     completed:{
         type:Boolean,
         default:false
     }
})

taskSchema.pre("save",async function(next){
    const task=this
    console.log("just before saving Tasx!")
    next()
})
// const Task=mongoose.model("Task",)

module.exports=Task
*/