import { NotFoundError } from '.././helpers/apiError'
import Author, { AuthorDocument } from './../models/Author'

//Create new author
const create = async (author: AuthorDocument): Promise<AuthorDocument> => {
  return author.save()
}

//Get all books from database

const getAll = async (): Promise<AuthorDocument[]> => {
  return Author.find({}).sort({ firstName: 1 })
}

//Get an author

const findById = async (authorId: string): Promise<AuthorDocument> => {
  const foundAuthor = await Author.findById(authorId)
  if (!foundAuthor) {
    throw new NotFoundError(`Author ${authorId} not found`)
  }
  return foundAuthor
}

//remove author
const deleteAuthor = async (
  authorId: string
): Promise<AuthorDocument | null> => {
  const foundAuthor = Author.findByIdAndDelete(authorId)
  if (!foundAuthor) {
    throw new NotFoundError(`Author ${authorId} not found`)
  }

  return foundAuthor
}

//Update authors
const update = async (
  authorId: string,
  update: Partial<AuthorDocument>
): Promise<AuthorDocument | null> => {
  const foundAuthor = await Author.findByIdAndUpdate(authorId, update, {
    new: true,
  })

  if (!foundAuthor) {
    throw new NotFoundError(`Author ${authorId} not found`)
  }
  return foundAuthor
}

export default { create, getAll, findById, deleteAuthor, update }
