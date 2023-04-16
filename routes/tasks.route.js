const express = require('express')
const router = express.Router()
const { getTaskList, getTaskProfleList } = require('../controllers/tasks.controller')

router.get('/get-task-list', getTaskList)
router.get('/get-task-profile', getTaskProfleList)

module.exports = router 