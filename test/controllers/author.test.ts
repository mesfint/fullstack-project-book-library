import request from 'supertest'
import { AuthorDocument } from '../../src/models/Author'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingAUthorId = '5e57b77b5744fa0b461c7906'

async function createAuthor(override?: Partial<AuthorDocument>) {
  let author = {
    firstName: 'Thomas',
    lastName: 'J',
  }

  if (override) {
    author = { ...author, ...override }
  }

  return await request(app).post('/api/v1/authors').send(author)
}

describe('author controller', () => {
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

  it('should create a author', async () => {
    const res = await createAuthor()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.firstName).toBe('Thomas')
  })
  it('should not create an author with wrong data', async () => {
    const res = await request(app).post('/api/v1/authors').send({
      firstName: 'yon kee ',
      //lastName: 'Toy',
    })
    expect(res.status).toBe(400)
  })

  it('should get back an existing author', async () => {
    let res = await createAuthor()
    expect(res.status).toBe(200)

    const authorId = res.body._id
    res = await request(app).get(`/api/v1/authors/${authorId}`)

    expect(res.body._id).toEqual(authorId)
  })

  it('should not get back a non-existing author', async () => {
    const res = await request(app).get(`/api/v1/authors/${nonExistingAUthorId}`)
    expect(res.status).toBe(404)
  })
  it('should get back all authors', async () => {
    const res1 = await createAuthor({
      firstName: 'hidity ',
      lastName: 't',
    })
    const res2 = await createAuthor({
      firstName: 'nathan ',
      lastName: 'mengeha',
    })

    const res3 = await request(app).get('/api/v1/authors')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should delete an existing author', async () => {
    let res = await createAuthor()
    expect(res.status).toBe(200)
    const authorId = res.body._id

    res = await request(app).delete(`/api/v1/authors/${authorId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/authors/${authorId}`)
    expect(res.status).toBe(404)
  })
})
