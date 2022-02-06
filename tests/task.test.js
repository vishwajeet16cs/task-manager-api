const request = require('supertest')
const app= require("../src/app")
const Task =require("../src/models/tasks")
const {userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create task for user",async()=>{
    const responce= await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tockens[0].tocken}`)
    .send({
        description:"From my test"
    })
    .expect(201)
    const task = await Task.findById(responce.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

    
})

test("Should fetch user tasks",async()=>{
    const responce=await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tockens[0].tocken}`)
    .send()
    .expect(200)
    expect(responce.body.length).toEqual(2)
})

test("Should not delete other users tasks",async()=>{
    const responce= await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tockens[0].tocken}`)
    .send()
    .expect(404)
    const  task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()    
})