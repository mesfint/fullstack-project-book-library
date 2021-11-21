import mongoose, { Document } from 'mongoose'

import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import UserBook, { UserBookType } from '../models/UserBook'
import UserBookService from '../services/userbook'

//Get all Users
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserBookService.getAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Get a userbook by Id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserBookService.getById(req.params.userBookId))

    res.status(201).json({
      message: 'Handling get by id requests to /userbook',
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
export const deleteUserBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserBookService.deleteUserBook(req.params.userId)
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

export const updateUserBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //const update = req.body
    const update: UserBookType = req.body
    const userBookId = req.params.userBookId
    const updatedUserBook = await UserBookService.update(userBookId, update)
    res.json(updatedUserBook)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
//Add userBook
export const createUserBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userBookId = new mongoose.Types.ObjectId()
    // const user = req.body.userId
    const userBookType: UserBookType = req.body
    const userbook = new UserBook({ ...userBookType, userBookId })

    await UserBookService.create(userbook)
    res.json(userbook)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
