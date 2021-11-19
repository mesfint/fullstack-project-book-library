/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Model } from 'mongoose'
export type UserType = {
  userId?: string
  firstName: string
  lastName: string
  userName?: string
  email?: string
  password?: string
  confirmPassword?: string
  profileImage?: string
  joinedDate?: string
  borrow?: boolean
  borrowDate?: string
  returnDate?: string
  isAdmin?: boolean
}
export interface UserDocument extends UserType, Document {}
export interface UserModel extends Model<UserDocument> {}

export const userSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: {
      type: String,
      lowercase: true,
      required: false,
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: false,

      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    profileImage: { type: String, required: false },
    password: { type: String, required: false },
    confirmPassword: { type: String, required: false },
    isAdmin: { type: Boolean, required: false },
    userBooks:[
      {type: mongoose.Schema.Types.ObjectId, ref: 'UserBook'}
    ]
    
  },

  { timestamps: true }
)

export default mongoose.model<UserDocument>('User', userSchema)
