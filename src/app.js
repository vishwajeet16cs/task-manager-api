const express= require('express')
require('./db/mongoose') 
const useRouter = require("./routers/user")
const taskRouter=require("./routers/task")

const app=express()
 

app.use(express.json())
app.use(useRouter)
app.use(taskRouter)


module.exports=app