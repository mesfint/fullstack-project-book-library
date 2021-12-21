import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'

import User, { UserType } from '../models/User'
import UserService from '../services/user'

//signup
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body
  try {
    const exisitingUser = await User.findOne({ email })
    if (exisitingUser)
      return res.status(400).json({ message: 'User already exists' })
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' })
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      isAdmin: email === 'mesfin2006@gmail.com' ? true : false,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      'JWT_SECRET',
      {
        expiresIn: '1h',
      }
    )
    res.status(200).json({ newUser, token })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

//Google Authenticate

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, id, firstName, lastName } = req.body as any
    const user = await UserService.findUserByEmail(email)
    console.log('user frm ----bkend', user)
    const token = jwt.sign({ email, id, firstName, lastName }, 'JWT_SECRET', {
      expiresIn: 60 * 60,
    })
    res.json({
      token,
      //user,
      user: { id: id, email, isAdmin: true, firstName, lastName },
    })
  } catch (error) {
    return next(error)
  }
}

// //create new User
// export const signUp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = new mongoose.Types.ObjectId()
//     const userType: UserType = req.body
//     const user = new User({ ...userType, userId })
//     const salt = await bcrypt.genSalt(10)
//     user.password = await bcrypt.hash(user.password, salt)
//     await UserService.create(user)
//     res.json(user)
//     console.log(salt)
//   } catch (error) {
//     if (error instanceof Error && error.name == 'ValidationError') {
//       next(new BadRequestError('Invalid Request', error))
//     } else {
//       next(error)
//     }
//   }
// }
