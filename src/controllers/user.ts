import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'
//import { check, validationResult } from 'express-validator'
import User, { UserType } from '../models/User'
import UserService from '../services/user'

//@route GET api/users/test
//@desc Tests users route
//@access Public
export const test = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Token validated,user authorized' })
}

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

//create new User/ sign up

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO: use email as unique identifier

    const userId = new mongoose.Types.ObjectId()
    const userType: UserType = req.body as any
    const user = new User({ ...userType, userId })

    let existingUser = await User.findOne({ email: user.email })
    if (!existingUser) {
      return res
        .status(400)
        .send({ message: 'User Route' })
        .json({ message: 'User already exists Please Login' })
    }

    //Encrypt password

    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = await bcrypt.hash(user.password, hashedPassword)

    //create a new user
    const newUser = await UserService.create(user)

    if (newUser) {
      const token = jwt.sign(
        {
          email: newUser.email,
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isAdmin: newUser.isAdmin,
        },
        'JWT_SECRET',
        {
          expiresIn: 60 * 60,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } else {
      res.status(400)
      throw new Error('Invalid User Data')
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //TODO: use email as unique identifier
//     const userId = new mongoose.Types.ObjectId()

//     const userType: UserType = req.body as any
//     const user = new User({ ...userType, userId })
//     const hashedPassword = await bcrypt.hash(user.password, 10)
//     user.password = await bcrypt.hash(user.password, hashedPassword)

//     const existingUser = await UserService.findUserByEmail(user.email)
//     if (existingUser)
//       return res.status(400).json({ message: 'User already existsss' })

//     if (user.password !== user.confirmPassword)
//       return res.status(400).json({ message: 'Passwords do not match' })

//     //if everything ok then create a new user
//     const result = await UserService.create(user)
//     // res.json(user)
//     const token = jwt.sign(
//       { email: result.email, id: result._id },
//       'JWT_SECRET',
//       {
//         expiresIn: 60 * 60,
//       }
//     )
//     res.status(200).json({ result, token })
//   } catch (error) {
//     if (error instanceof Error && error.name == 'ValidationError') {
//       next(new BadRequestError('Invalid Request', error))
//     } else {
//       next(error)
//     }
//   }
// }
