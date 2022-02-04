const express= require('express')
require('./db/mongoose')// to connect mongoos to database 
const useRouter = require("./routers/user")
const taskRouter=require("./routers/task")

const app=express()
const port= process.env.PORT
const data=process.env.SENDGRID_API_KEY 

app.use(express.json())
app.use(useRouter)
app.use(taskRouter)

// console.log("key")
// console.log("key")
app.listen(port,()=>{
    console.log('Server is up on port '+port)
    // console.log(data)
})


// we can call middleware above app.use(useRoute&taskRouyte)
/* app.use((req,res,next)=>{
    if(req.method=="GET"){
        res.send("Get request is disabled")
    }else{
        next()
    }
}) */

// app.use((req,res,next)=>{
//  res.status(503).send("site is currently down. Check back soon!")
// })


// const multer = require('multer')
// const upload = multer({
//     dest:"images", 
//     limits:{
//         fileSize:1000000//1 mega bit
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error("please upload a word document "))
//         }
//         cb(undefined,true)
//     }
// })
// /* const errorMiddleware = (req,res,next)=>{
//     throw new Error("from mt middleware")
// } */
// app.post("/upload",upload.single("upload"),(req,res)=>{
//     res.send() 
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })