const jwt=require('jsonwebtoken')
const mongoose=require("mongoose")
const User= require("../../src/models/user")
const Task = require("../../src/models/tasks")


const userOneId= new mongoose.Types.ObjectId()

const userOne={
    _id:userOneId,
    name:"vishwajeet",
    email:"vishwajeet@gmail.com",
    password:"1234567",
    tockens:[{
        tocken:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId= new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:"amarjeet",
    email:"amarjeet@gmail.com",
    password:"1234567",
    tockens:[{
        tocken:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}
 
const taskOne={
    _id:new mongoose.Types.ObjectId(),
    description:"First task",
    completed:false,
    owner:userOne._id
}

const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    description:"second task",
    completed:true,
    owner:userOne._id
}

const taskThree={
    _id:new mongoose.Types.ObjectId(),
    description:"third task",
    completed:true,
    owner:userTwo._id
}

const setupDatabase=async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOneId,
    userOne,
    setupDatabase,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}