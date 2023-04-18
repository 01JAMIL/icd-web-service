const express = require('express')
const router = express.Router()
const { getSkillsTasksMiddleCategory, getSkillsTasksMinorCategory } = require('../controllers/taskXskill.controller')

router.post('/get-tasks-x-skills-middle', getSkillsTasksMiddleCategory)
router.post('/get-tasks-x-skills-minor', getSkillsTasksMinorCategory)

module.exports = router 