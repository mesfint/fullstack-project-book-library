import express from 'express'

import {
  createAuthor,
  getAll,
  findById,
  deleteAuthor,
  updateAuthor,
} from '../controllers/author'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes
router.get('/', getAll)
router.get('/:authorId', findById)
router.put('/:authorId', updateAuthor)
router.delete('/:authorId', deleteAuthor)
router.post('/', createAuthor)

export default router
