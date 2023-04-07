const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get('/api/user', (req, res) => {
    res.status(200).send({
        firstName: 'Jamil',
        lastName: 'BEN BRAHIM',
        occupation: 'Software developer'
    })
})

app.listen(3000, () => {
    console.log('Server running on port 3000 ...')
})