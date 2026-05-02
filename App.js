import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './Config/dbConfig.js'
import userRoutes from './Route/userRoute.js'
import accountRoutes from './Route/accountRoute.js'
import transferRoutes from './Route/transferRoute.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'EliPay API is running',
    version: '1.0.0'
  })
})

app.use('/api/users', userRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/transfers', transferRoutes)

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB()
    
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

startServer()