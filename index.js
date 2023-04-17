const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const skillsRouter = require('./routes/skills.route')
const tasksRouter = require('./routes/tasks.route')
const tasksSkillsRouter = require('./routes/taskXskill.route')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.use('/api/skills', skillsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/tasksxskills', tasksSkillsRouter)

const port = process.env.PORT || 3100

app.listen(port, () => {
    console.log(`Server running on port ${port} ...`)
})