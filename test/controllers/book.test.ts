import request from 'supertest'
import { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'

async function createBook(override?: Partial<BookDocument>) {
  let book = {
    title: 'The Art of Thinking',
    publishedYear: 2019,
    quantity: 3,
    isbn: 3,
    categories: ['crime', 'suspense'],
    summary: 'ddsjdhdj',
  }

  if (override) {
    book = { ...book, ...override }
  }

  return await request(app).post('/api/v1/books').send(book)
}

describe('book controller', () => {
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
    const res = await createBook()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('The Art of Thinking')
  })
  it('should not create a book with wrong data', async () => {
    const res = await request(app).post('/api/v1/books').send({
      //title: 'The Art of Thinking',
      //publishedYear: 2019,
      quantity: 3,
      isbn: 3,
      //categories: ['crime', 'suspense'],
      //summary: 'ddsjdhdj',
    })
    expect(res.status).toBe(400)
  })

  it('should get back an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)

    const bookId = res.body._id
    res = await request(app).get(`/api/v1/books/${bookId}`)

    expect(res.body._id).toEqual(bookId)
  })

  it('should not get back a non-existing book', async () => {
    const res = await request(app).get(`/api/v1/books/${nonExistingBookId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all book', async () => {
    const res1 = await createBook({
      title: 'The Nordic Theory ',
      publishedYear: 2000,
    })
    const res2 = await createBook({
      title: 'The WOrld war II',
      publishedYear: 2006,
    })

    const res3 = await request(app).get('/api/v1/books')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should delete an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)
    const bookId = res.body._id

    res = await request(app).delete(`/api/v1/books/${bookId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/books/${bookId}`)
    expect(res.status).toBe(404)
  })
})
