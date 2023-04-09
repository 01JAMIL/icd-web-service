const express = require('express')
const router = express.Router()
const { getJobList, getJobSkills } = require('../controllers/job-list.controller')

router.get('/jobs', getJobList)
router.get('/jobxskill', getJobSkills)

module.exports = router