const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const skillsRouter = require('./routes/job-list.route')
const tasksRouter = require('./routes/tasks.route')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.use('/api', skillsRouter)
app.use('/api', tasksRouter)

const port = process.env.PORT || 3100

app.listen(port, () => {
    console.log(`Server running on port ${port} ...`)
    console.log(`http://localhost:${port}/api`)
})