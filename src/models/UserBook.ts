import mongoose, { Document } from 'mongoose'

export type UserBookType = {
  userBookId: string
  user: unknown
  book: unknown
  joinedDate: string
  borrow?: boolean
  borrowDate?: string
  returnDate?: string
}

export type UserBookDocument = Document & UserBookType

export const userBookSchema = new mongoose.Schema(
  {
    userBookId: mongoose.Schema.Types.ObjectId,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrow: { type: Boolean, required: true },
    borrowDate: { type: Date, default: Date.now, required: true },
    returnDate: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<UserBookDocument>('UserBook', userBookSchema)
