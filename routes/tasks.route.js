const express = require('express')
const router = express.Router()
const { getTaskList, getTaskProfleList } = require('../controllers/tasks.controller')

router.get('/tasks', getTaskList)
router.get('/task-profile', getTaskProfleList)

module.exports = router 