const express = require('express')
const { saveDataIntoDocument, search } = require('../controllers/task-search.controller')
const router = express.Router()

router.post('/save-tasks', saveDataIntoDocument)
router.post('/tasks', search)
module.exports = router 