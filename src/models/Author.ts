/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type AuthorDocument = Document & {
  authorId: string
  firstName: string
  lastName: string
}

const authorSchema = new mongoose.Schema({
  authorId: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 100,
  },
})

export default mongoose.model<AuthorDocument>('Author', authorSchema)
