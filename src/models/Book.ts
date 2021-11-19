/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'

export type BookDocument = Document & {
  bookId: string
  isbn: number
  title: string
  publishedYear: string
  status: string
  coverImage: string
  pageNumber: number
  quantity: number
  rating: number
  summary: string
  categories: string
}

const bookSchema = new mongoose.Schema({
  bookId: mongoose.Schema.Types.ObjectId,
  isbn: { type: Number, required: false },
  title: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Date,
    required: false,
    default: Date.now,
  },

  status: { type: String, required: false },
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
  categories: [{
    type: String
  }],
  userBooks:[
    {type: mongoose.Schema.Types.ObjectId, ref: 'UserBook'}
  ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
})

// modify the output from _id to id
bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model<BookDocument>('Book', bookSchema)
