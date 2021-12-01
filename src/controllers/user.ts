import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'

import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import User, { UserType } from '../models/User'
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
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))

    res.status(201).json({
      message: 'Handling get by id requests to /users',
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
//Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)

    res.status(200).json({ status: true, message: 'Deleted with success' })
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
    //const update = req.body
    const update: UserType = req.body
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

//create new User
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new mongoose.Types.ObjectId()
    const userType: UserType = req.body
    const user = new User({ ...userType, userId })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await UserService.create(user)
    res.json(user)
    console.log(salt)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//login existed users

//  export const signInUser = async (
//    req: Request,
//    res: Response,
//    next: NextFunction
//  ) => {
//    try {
//      const userId = new mongoose.Types.ObjectId()
//       const user = req.body.userId
//      const userType: UserType = req.body
//       await User.findOne($or:[{email:userType.email },{userName:userType.userName}])

//        await UserService.signInUser(user)
//        res.json(user)
//        } catch (error) {
//        if (error instanceof Error && error.name == 'ValidationError') {
//          next(new BadRequestError('Invalid Request', error))
//        } else {
//          next(error)
//        }
//        }
