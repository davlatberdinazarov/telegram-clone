require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

// Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(errorMiddleware)
app.use(cors({ origin: process.env.CLIENT_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'] }))
app.use(cookieParser())

app.use('/api', require('./routes/index'))


const bootstrap = async () => {
	try {
		const PORT = process.env.PORT || 6000
		mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
		app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
	} catch (error) {
		console.error(error)
	}
}

bootstrap()