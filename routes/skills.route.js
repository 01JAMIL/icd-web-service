const express = require('express')
const router = express.Router()
const { getJobList, getJobSkills } = require('../controllers/skills.controller')

router.get('/get-job-list', getJobList)
router.get('/get-job-skill/:jobCode', getJobSkills)

module.exports = router