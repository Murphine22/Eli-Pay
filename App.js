import express from 'express'
import dotenv from 'dotenv'
import connectDB from './Config/dbConfig.js'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB
connectDB()

app.get('/hello', (req, res) => {
  res.send('Hello')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})