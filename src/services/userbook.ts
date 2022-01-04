import UserBook, { UserBookDocument } from './../models/UserBook'
import { NotFoundError } from '../helpers/apiError'

//Create new userBook
const create = async (
  userbook: UserBookDocument
): Promise<UserBookDocument> => {
  return userbook.save()
}

//Get all usersbook from database

const getAll = async (): Promise<UserBookDocument[]> => {
  return UserBook.find().sort({ borrowDate: 1 }).populate(['user', 'book'])
}

//Get a User

const getById = async (userBookId: string): Promise<UserBookDocument> => {
  const foundUserBook = await UserBook.findById(userBookId)
  if (!foundUserBook) {
    throw new NotFoundError(`User Book ${userBookId} not found`)
  }
  return foundUserBook
}

//remove user book
const deleteUserBook = async (
  userBookId: string
): Promise<UserBookDocument | null> => {
  const foundUserBook = UserBook.findByIdAndDelete(userBookId)
  if (!foundUserBook) {
    throw new NotFoundError(`User ${userBookId} not found`)
  }

  return foundUserBook
}

//Update users
const update = async (
  userBookId: string,
  update: Partial<UserBookDocument>
): Promise<UserBookDocument | null> => {
  const foundUserBook = await UserBook.findByIdAndUpdate(userBookId, update, {
    new: true,
  })

  if (!foundUserBook) {
    throw new NotFoundError(`User Book ${userBookId} not found`)
  }
  return foundUserBook
}

export default { create, getAll, getById, deleteUserBook, update }
