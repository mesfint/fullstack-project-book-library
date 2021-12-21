/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'

export type BookType = {
  bookId: string
  isbn: number
  title: string
  publishedYear: number
  // status: 'On Hold' | 'Reserved' | 'Maintenance'
  coverImage: string
  pageNumber: number
  quantity: number
  rating: number
  summary: string
  category: string
}

export type BookDocument = BookType & Document

const bookSchema = new mongoose.Schema({
  bookId: mongoose.Schema.Types.ObjectId,
  isbn: { type: Number, required: false },
  title: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1900,
  },

  // status: { type: String, required: false },
  coverImage: { type: String, required: false },
  pageNumber: {
    type: Number,
    required: false,
    default: 10,
  },
  quantity: {
    type: Number,
    min: 1,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    min: 1,
  },
  summary: {
    type: String,
    required: false,
    minlength: 5,
  },


  category: String,
  //userBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserBook' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },

})

export default mongoose.model<BookDocument>('Book', bookSchema)
