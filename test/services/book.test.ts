import { BookDocument } from './../../src/models/Book'
import Book from '../../src/models/Book'
import BookService from '../../src/services/book'
import connect, { MongodHelper } from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'

async function createBook() {
  const book = new Book({
    title: 'The Art of Thinking',
    publishedYear: 2019,
    quantity: 3,
    isbn: 3,
    categories: ['crime', 'suspense'],
    summary: 'ddsjdhdj',
  })
  return await BookService.create(book)
}

describe('book service', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should create a book', async () => {
    const movie = await createBook()
    expect(movie).toHaveProperty('_id')
    expect(movie).toHaveProperty('title', 'The Art of Thinking')
    expect(movie).toHaveProperty('quantity', 3)
  })
  it('should get a book with id', async () => {
    const book = await createBook()
    const found = await BookService.findById(book._id)
    expect(found.title).toEqual(book.title)
    expect(found._id).toEqual(book._id)
  })
  it('should not get a non-existing book', async () => {
    expect.assertions(1)
    return BookService.findById(nonExistingBookId).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`)
    })
  })
  it('should update an existing book', async () => {
    const book = await createBook()
    const update = {
      title: 'The Home of Gypsys',
      publishedYear: 2000,
    }
    const updated = await BookService.update(book._id, update)
    expect(updated).toHaveProperty('_id', book._id)
    expect(updated).toHaveProperty('title', 'The Home of Gypsys')
    expect(updated).toHaveProperty('publishedYear', 2000)
  })
  it('should not update a non-existing book', async () => {
    expect.assertions(1)
    const update = {
      title: 'Shrek',
      publishedYear: 2001,
    }

    return BookService.update(nonExistingBookId, update).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`)
    })
  })
})
