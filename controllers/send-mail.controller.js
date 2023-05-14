const axios = require('axios')
const asyncHandler = require('express-async-handler')


const sendMail = asyncHandler(async (req, res) => {
    const { toEmails, jobDescription } = req.body
    // toEmails is an array of emails

    const personalizations = toEmails.map(email => ({
        // Create a personalization for each email
        to: [{ email }],
        dynamic_template_data: { jobDescription },
    }));

    const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send', {

        personalizations,
        from: { email: process.env.SENDER_EMAIL },
        template_id: process.env.TEMPLATE_ID,
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.SEND_GRID_API_KEY}`,
            'Content-Type': 'application/json'
        }
    }
    )


    res.status(200).send('Email sent' + response.data);
})


module.exports = {
    sendMail
}