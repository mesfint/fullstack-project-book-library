import User, { UserDocument } from './../models/User'
import { NotFoundError } from '../helpers/apiError'

//Create new User
const create = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

//Get all users from database

const getAll = async (): Promise<UserDocument[]> => {
  return User.find().sort({ firstName: 1 })
}

//Get a User

const getById = async (userId: string): Promise<UserDocument> => {
  const foundUser = await User.findById(userId)
  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return foundUser
}

//remove user
const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const foundUser = User.findByIdAndDelete(userId)
  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

//Update users
const update = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const foundUser = await User.findByIdAndUpdate(userId, update, { new: true })

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return foundUser
}

export default { create, getAll, getById, deleteUser, update }
