import express from 'express'

import {
  createUserBook,
  getAll,
  getById,
  deleteUserBook,
  updateUserBook,
} from '../controllers/userbook'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes
router.get('/', getAll)
router.get('/:userBookId', getById)
router.put('/:userBookId', updateUserBook)
router.delete('/:userBookId', deleteUserBook)
router.post('/', createUserBook)

export default router
