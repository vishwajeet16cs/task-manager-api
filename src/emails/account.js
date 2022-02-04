const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)//to sendgrid for which api we are going to work
console.log("after key")
const sendWelcomeEmail =(email,name)=>{
    console.log("inside welcome email")
    // console.log(process.env.SENDGRID_API_KEY)
    sgMail.send({
        to:email,
        from:"vishwajeetkumarb438@gmail.com",
        subject:"Thanks for joining in!",
        text:`Welcome to app, ${name}. let me know how you get along with the app.`,
    })
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"vishwajeetkumarb438@gmail.com",
        subject:"ok good buy",
        text:`Goodbuy, ${name}. I hope to see you back sometime soon`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}
/* sgMail.send({
    to:"vishwajeetkumarb438@gmail.com"  ,
    from:"vishwajeetkumarb438@gmail.com" ,
    subject:"This is my first creation",
    text:"I hope you are doing wail"
}) */