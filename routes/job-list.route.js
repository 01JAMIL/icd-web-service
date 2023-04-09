const express = require('express')
const router = express.Router()
const { getJobList, getJobSkills } = require('../controllers/job-list.controller')

router.get('/jobs', getJobList)
router.get('/jobxskill/:jobCode', getJobSkills)

module.exports = router