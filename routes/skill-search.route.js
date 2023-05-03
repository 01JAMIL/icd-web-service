const express = require('express')
const router = express.Router()
const { search, saveDataIntoDocument } = require('../controllers/skill-search.controller')

router.post('/save-skills/:jobCode', saveDataIntoDocument)
router.post('/skills', search)

module.exports = router