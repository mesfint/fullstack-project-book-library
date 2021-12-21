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

//find user by email
const findUserByEmail = async (email?: string): Promise<UserDocument> => {
  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new NotFoundError(`User ${email} not found`)
  }
  return existingUser
}

//find user or create new user
const findOrCreate = async (payload: Partial<UserDocument>) => {
  return User.findOne({ email: payload.email })
    .exec() //return a true Promise
    .then((user) => {
      if (!user) {
        const newUser = new User({
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: payload.password,
        })
        console.log('payload', payload)
        newUser.save()
        return newUser
      }
      return user
    })
    .catch((e) => console.log(e))
}

//Get a User

const findById = async (userId: string): Promise<UserDocument> => {
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

export default {
  create,
  getAll,
  findById,
  findOrCreate,
  findUserByEmail,
  deleteUser,
  update,
}
