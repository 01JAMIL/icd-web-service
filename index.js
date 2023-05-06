const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const skillsRouter = require('./routes/skills.route')
const tasksRouter = require('./routes/tasks.route')
const tasksSkillsRouter = require('./routes/taskXskill.route')
const skillsSearch = require('./routes/skill-search.route')
const tasksSearch = require('./routes/task-search-route')
require('dotenv').config()


const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.use('/api/skills', skillsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/tasksxskills', tasksSkillsRouter)
app.use('/api/search', skillsSearch)
app.use('/api/search', tasksSearch)

const port = process.env.PORT || 3100

app.listen(port, () => {
    console.log(`Server running on port ${port} ...`)
})