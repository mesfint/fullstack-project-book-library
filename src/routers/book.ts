import express from 'express'

import {
  createBook,
  getAll,
  getById,
  deleteBook,
  updateBook,
} from '../controllers/book'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes
router.get('/', getAll)
router.get('/:bookId', getById)
router.put('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.post('/', createBook)

export default router
