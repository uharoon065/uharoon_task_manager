const sgMail = require('@sendgrid/mail')
const  myKey = process.env.SENDGRID_KEY;
sgMail.setApiKey(myKey)
const sendWelcomeMail = (name ,email)=> {
    const msg = {
        to: email,
    from: "uharoon065@gmail.com",
    subject: "Greetings !!!!!",
    text: `welcome ${name} to the app. We hope you enjoy using our service`
}
sgMail.send(msg)
} // function ends

const sendGoodByeMail= (name ,email)=> {
    const msg = {
        to: email,
    from: "uharoon065@gmail.com",
    subject: "GoodBye",
    text: `Goodbye  ${name}. Please write back  to us so we can improve our service  and to keep valueable customers like you.`
}
sgMail.send(msg)
} // function ends
module.exports = { sendWelcomeMail, sendGoodByeMail}