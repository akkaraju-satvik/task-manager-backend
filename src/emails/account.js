    const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'satvik.akkaraju@gmail.com',
        subject: 'Welcome to Task App',
        text: `Welcome to Task App, ${name}. Hope you have a great time!`
    })
}

const cancelEmail = (email) => {
    sgMail.send({
        to: email,
        from: 'satvik.akkaraju@gmail.com',
        subject: 'Sorry to see you leave!',
        text: `Are you sure you want to leave? Tell us what could've been done better.`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}