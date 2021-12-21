import { AuthorDocument } from './../../src/models/Author'
import Author from '../../src/models/Author'
import AuthorService from '../../src/services/author'
import connect, { MongodHelper } from '../db-helper'

const nonExistingAuthorId = '5e57b77b5744fa0b461c7906'

async function createAuthor() {
  const author = new Author({
    firstName: 'Mr. Tho',
    lastName: 'JAck',
  })
  return await AuthorService.create(author)
}

describe('author service', () => {
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
    const movie = await createAuthor()
    expect(movie).toHaveProperty('_id')
    expect(movie).toHaveProperty('firstName', 'Mr. Tho')
    expect(movie).toHaveProperty('lastName', 'JAck')
  })
  it('should get a author with id', async () => {
    const author = await createAuthor()
    const found = await AuthorService.findById(author._id)
    expect(found.firstName).toEqual(author.firstName)
    expect(found._id).toEqual(author._id)
  })
  it('should not get a non-existing author', async () => {
    expect.assertions(1)
    return AuthorService.findById(nonExistingAuthorId).catch((e) => {
      expect(e.message).toMatch(`Author ${nonExistingAuthorId} not found`)
    })
  })

  it('should update an existing author', async () => {
    const author = await createAuthor()
    const update = {
      firstName: 'SOl',
      lastName: 'Eth',
    }
    const updated = await AuthorService.update(author._id, update)
    expect(updated).toHaveProperty('_id', author._id)
    expect(updated).toHaveProperty('firstName', 'SOl')
    expect(updated).toHaveProperty('lastName', 'Eth')
  })
  it('should not update a non-existing author', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'Shrek',
      lastName: 'Kiw',
    }

    return AuthorService.update(nonExistingAuthorId, update).catch((e) => {
      expect(e.message).toMatch(`Author ${nonExistingAuthorId} not found`)
    })
  })
})
