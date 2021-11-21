import express from 'express'

import {
  createBook,
  getAll,
  findById,
  deleteBook,
  updateBook,
} from '../controllers/book'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//handlers for the routes
router.get('/', getAll)
router.get('/:bookId', findById)
router.put('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.post('/', createBook)

export default router
