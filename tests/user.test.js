const request = require('supertest')
const app=require('../src/app')
const User =require("../src/models/user")
const {userOneId,userOne,setupDatabase} = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should signup a new user",async()=>{
    const response = await request(app).post("/users").send({
        name:"alfaz",
        email:"alfaz11@gmail.com",
        password:"1234567"
    }).expect(201)
    

    //Assert that the database was change correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user:{
            name:"alfaz",
            email:"alfaz11@gmail.com"
        },
        tocken:user.tockens[0].tocken
    })  
    expect(user.password).not.toBe("1234567")  
})

test("Should login existing user",async()=>{
// const user = await User.findById(response.body.user._id)

    const responce = await request(app).post("/users/login").send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(responce.body.tocken).toBe(user.tockens[1].tocken)
})

test("Should not login nonexisting user",async()=>{
    await request(app).post("/users/login").send({
        email:"user@gmail.com",
        password:"1234567"
    }).expect(400)
})

test("Should get profile for user",async()=>{
    // console.log(userOne)
    await request(app)
        .get("/users/me")
        .set("Authorization",`Bearer ${userOne.tockens[0].tocken}`)
        .send()
        .expect(200)
})

test("Should not get profile for unauthenticated user",async()=>{
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete account for user",async()=>{
    await request(app)
    .delete("/users/me")
    .set("Authorization",`Bearer ${userOne.tockens[0].tocken}`)// header
    .send()
    .expect(200)
    const user= await User.findById(userOneId)
    expect(user).toBeNull()
})


test("Should not delete account for unauthenticate user",async()=>{
    await request(app)
    .delete("/users/me")
    .send()
    .expect(401)
})

test("Should upload avatar image", async ()=>{
    await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tockens[0].tocken}`)
    .attach("avatar","tests/fixtures/profile-pic.jpg")
    .expect(200)
    const user= await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields",async()=>{
    await request(app).patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tockens[0].tocken}`)
    .send({
        name:"Amarjeet",
    })
    .expect(200)
    const user= await User.findById(userOneId)
    // expect(user.name).toBe("Amarjeet")
    expect(user.name).toEqual("Amarjeet")
})

test("Should not update invalid fields",async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tockens[0].tocken}`)
    .send({
        location:"Bangalore"
    })
    .expect(400)
})
