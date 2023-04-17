const express = require('express')
const router = express.Router()
const { getSkillsTasks } = require('../controllers/taskXskill.controller')

router.get('/get-tasks-x-skills-middle', getSkillsTasks)

module.exports = router 