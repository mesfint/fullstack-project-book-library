import express from 'express'
import passport from 'passport'

import {
  signin,
  getAll,
  findById,
  deleteUser,
  updateUser,
} from '../controllers/user'
import { signUp, authenticate } from '../controllers/auth'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes

router.get('/', getAll)
//router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/signup', signUp)
router.post('/signin', signin)

router.post(
  '/google-authenticate',
  passport.authenticate('google-id-token', { session: false }),
  authenticate
)
export default router
