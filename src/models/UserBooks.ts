/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'
export type UserBookType = {
  userBookId: string;
  user: unknown;
  book: unknown;
  joinedDate: string;
  borrow?: boolean
  borrowDate?: string
  returnDate?: string
}
export type UserBookDocument = Document & UserBookType

export const UserBookSchema = new mongoose.Schema(
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
    joinedDate: { type: Date, default: Date.now, required: false },
    borrow: { type: Boolean, required: false },
    borrowDate: { type: Date, default: Date.now, required: false },
    returnDate: { type: Date, default: Date.now, required: false },
  },

  { timestamps: true }
)

export default mongoose.model<UserBookDocument>('UserBook', UserBookSchema)
