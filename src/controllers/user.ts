import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
//custom Signin---continue
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist!" })
    }
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password)

    const userForToken = {
      email: user.email,
      id: user._id,
    }
    //token expires in 1 hour
    const token = jwt.sign(userForToken, 'JWT_SECRET', {
      expiresIn: 60 * 60,
    })
    res.status(200).json({ token, email: user.email, id: user._id })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//create new User/ sign up
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
//       return res.status(400).json({ message: 'User already exists' })

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

