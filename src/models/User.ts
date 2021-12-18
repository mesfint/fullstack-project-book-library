/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type UserType = {
  userId: string
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  confirmPassword: string
  isAdmin: boolean
}

export type UserDocument = Document & UserType

export const userSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: {
      type: String,
      lowercase: true,
      required: false,
    },
    email: {
      type: String,
      lowercase: false,
      required: true,

      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
      index: true,
    },
    password: { type: String, required: false },
    confirmPassword: { type: String, required: false },
    isAdmin: { type: Boolean, required: false },

    joinedDate: { type: Date, default: Date.now(), required: false },
  },

  { timestamps: true }
)

export default mongoose.model<UserDocument>('User', userSchema)
