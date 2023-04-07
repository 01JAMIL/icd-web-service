const express = require('express')
const router = express.Router()
const { getJobList } = require('../controllers/job-list.controller')

router.get('/jobs', getJobList)

module.exports = router