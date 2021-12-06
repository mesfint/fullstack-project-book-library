import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'

import { googleStrategy, jwtStrategy } from './config/passport'
import movieRouter from './routers/movie'
import bookRouter from './routers/book'
import userRouter from './routers/user'
import userBooksRouter from './routers/userbook'
import authorRouter from './routers/author'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import compression from 'compression'
import bodyParser from 'body-parser'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  cors({
    methods: '*',
    origin: process.env.CORS_CONFIG_ORIGIN?.split(';') ?? [],
    allowedHeaders: '*',
  })
)
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)
app.use(bodyParser.json())
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(passport.initialize())
app.use(passport.session())
app.use(compression())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// Custom API error handler
app.use(apiErrorHandler)

// Use movie router
passport.use(googleStrategy)
passport.use(jwtStrategy)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/books', bookRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/userBooks', userBooksRouter)
app.use('/api/v1/authors', authorRouter)

export default app
