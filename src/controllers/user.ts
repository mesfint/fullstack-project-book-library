import mongoose, { Document } from 'mongoose'

import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import User, { UserType } from '../models/User'
import UserService from '../services/user'
import { apiBaseRequest } from './baseApi'

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => apiBaseRequest(next, async() => {
  res.json(await UserService.getAll())
});

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => apiBaseRequest(next, async() => {
  res.json(await UserService.getById(req.params.userId))

  res.status(201).json({
    message: 'HAndling get by id requests to /users',
  })
});

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => apiBaseRequest(next, async() => {
  await UserService.deleteUser(req.params.userId)
  res.status(204).end()
});

//Update users
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => apiBaseRequest(next, async() => {
  const update = req.body
  const userId = req.params.userId
  const updatedUser = await UserService.update(userId, update)
  res.json(updatedUser)
});

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => apiBaseRequest(next, async() => {
  const userId = new mongoose.Types.ObjectId()
  const book = req.body.bookId
  const userType: UserType= req.body
  const user = new User({...userType, book, userId})
  await UserService.create(user)
  res.json(user)
});
