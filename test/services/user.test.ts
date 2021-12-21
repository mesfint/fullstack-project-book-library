import { UserDocument } from './../../src/models/User'
import User from '../../src/models/User'
import UserService from '../../src/services/user'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    firstName: 'name1',
    lastName: 'Name1',
    userName: 'name',
    email: 'name@gmail.com',
    password: 'df',
    isAdmin: false,
  })
  return await UserService.create(user)
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
  it('should create a user', async () => {
    const movie = await createUser()
    expect(movie).toHaveProperty('_id')
    expect(movie).toHaveProperty('firstName', 'name1')
    expect(movie).toHaveProperty('lastName', 'Name1')
  })
  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    expect(found.firstName).toEqual(user.firstName)
    expect(found._id).toEqual(user._id)
  })
  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })
  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      firstName: 'meme',
      lastName: 'nunu',
      userName: 'mm',
      email: 'name@g.com',
      password: 'wf',
      isAdmin: true,
    }
    const updated = await UserService.update(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('firstName', 'meme')
    expect(updated).toHaveProperty('lastName', 'nunu')
  })
  it('should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'Shrek',
      lastName: 'jdfh',
    }

    return UserService.update(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })
})
