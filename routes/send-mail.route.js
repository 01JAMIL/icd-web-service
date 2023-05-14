const express = require('express')
const router = express.Router()
const { sendMail } = require('../controllers/send-mail.controller')

router.post('/send-email', sendMail)

module.exports = router 
