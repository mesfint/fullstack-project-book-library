import { NotFoundError } from '.././helpers/apiError'
import Book, { BookDocument } from './../models/Book'

//Create new book
const create = async (book: BookDocument): Promise<BookDocument> => {
  return book.save()
}

//Get all books from database

const getAll = async (): Promise<BookDocument[]> => {
  return Book.find().sort({ title: 1, publishedYear: -1 })
}

//Get a book

const findById = async (bookId: string): Promise<BookDocument> => {
  const foundBook = await Book.findById(bookId)
  if (!foundBook) {
    throw new NotFoundError(`Book ${bookId} not found`)
  }
  return foundBook
}

//remove books
const deleteBook = async (bookId: string): Promise<BookDocument | null> => {
  const foundBook = Book.findByIdAndDelete(bookId)
  if (!foundBook) {
    throw new NotFoundError(`Book ${bookId} not found`)
  }

  return foundBook
}

//Update books
const update = async (
  bookId: string,
  update: Partial<BookDocument>
): Promise<BookDocument | null> => {
  const foundBook = await Book.findByIdAndUpdate(bookId, update, { new: true })

  if (!foundBook) {
    throw new NotFoundError(`Book ${bookId} not found`)
  }
  return foundBook
}

export default { create, getAll, findById, deleteBook, update }
