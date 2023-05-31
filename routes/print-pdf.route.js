const express = require('express')
const router = express.Router()
const { printPdf } = require('../controllers/print-pdf.controller')

router.post('/generate-pdf', printPdf)

module.exports = router 