import mongoose, { Document } from 'mongoose'

import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import User from '../models/User'
import UserService from '../services/user'

//Get all Users
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.getAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Get a user by Id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.getById(req.params.userId))

    res.status(201).json({
      message: 'HAndling get by id requests to /users',
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
//Delete book
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Update users

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updatedUser = await UserService.update(userId, update)
    res.json(updatedUser)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Add User
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new mongoose.Types.ObjectId()
    const book = req.body.bookId
    const {
      firstName,
      lastName,
      userName,
      email,
      image,
      password,
      confirmPassword,
      isAdmin,
      joinedDate,
      borrow,
      borrowDate,
      returnDate,
    } = req.body
    const user = new User({
      userId,
      firstName,
      lastName,
      userName,
      email,
      image,
      password,
      confirmPassword,
      isAdmin,
      joinedDate,
      borrow,
      book,
      borrowDate,
      returnDate,
    })
    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
