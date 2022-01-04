import express from 'express'
import passport from 'passport'

import {
  getAll,
  findById,
  deleteUser,
  updateUser,
  test,
} from '../controllers/user'
//import { registerValidator } from '../util/userValidator';
//import { body, validationResult } from 'express-validator'

import { signUp, signIn, authenticate } from '../controllers/auth'
import { auth } from '../middlewares/auth'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
//handlers for the routes

router.get('/', getAll)
//router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.get('/:userId', auth, findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/signup', signUp)
router.post('/signin', auth, signIn)
router.get('/test', auth, test)

//router.post('/',auth, createUser)

router.post(
  '/google-authenticate',
  passport.authenticate('google-id-token', { session: false }),
  authenticate
)
export default router
