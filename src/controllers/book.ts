import mongoose, { Document } from 'mongoose'
//import { findById } from './movie'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import Book from '../models/Book'
import BookService from '../services/book'

//Add books
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = new mongoose.Types.ObjectId()
    const {
      isbn,
      title,
      publishedYear,
      status,
      coverImage,
      pageNumber,
      quantity,
      rating,
      summary,
      categories,
    } = req.body
    const book = new Book({
      bookId,
      isbn,
      title,
      publishedYear,
      status,
      coverImage,
      pageNumber,
      quantity,
      rating,
      summary,
      categories,
    })
    await BookService.create(book)
    res.json(book)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Get all books
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await BookService.getAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
//Get a book by Id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await BookService.getById(req.params.bookId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Delete book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await BookService.deleteBook(req.params.bookId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Update books

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const bookId = req.params.bookId
    const updatedBook = await BookService.update(bookId, update)
    res.json(updatedBook)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
