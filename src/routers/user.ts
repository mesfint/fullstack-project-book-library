import express from 'express'

import {
  createUser,
  getAll,
  getById,
  deleteUser,
  updateUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes
router.get('/', getAll)
router.get('/:userId', getById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/', createUser)

export default router
