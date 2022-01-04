import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
//import { check, validationResult } from 'express-validator'
import { BadRequestError } from './../helpers/apiError'

import User, { UserType } from '../models/User'
import UserService from '../services/user'

//Sign In

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  try {
    const user = await UserService.findUserByEmail(email)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new BadRequestError('Invalid password')
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
      'JWT_SECRET',
      {
        expiresIn: '1h',
      }
    )
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

//custom Signin

//     const userForToken = {
//       email: user.email,
//       id: user._id,
//     }
//     //token expires in 1 hour
//     const token = jwt.sign(userForToken, 'JWT_SECRET', {
//       expiresIn: 60 * 60,
//     })
//     // save user token
//     user.token = token

//     res.status(200).json({ token, email: user.email, id: user._id })
//   } catch (error) {
//     if (error instanceof Error && error.name == 'ValidationError') {
//       next(new BadRequestError('Invalid Request', error))
//     } else {
//       next(error)
//     }
//   }
// }

//signup
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO:

    const userId = new mongoose.Types.ObjectId()
    const userType: UserType = req.body as any
    const user = new User({ ...userType, userId })

    //see if user already exists

    const existingUser = await User.findOne({ email: user.email })
    console.log('existingUser', existingUser)
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'User already exists Please Login' })

    //Encrypt password

    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = await bcrypt.hash(user.password, hashedPassword)
    user.confirmPassword = await bcrypt.hash(user.password, hashedPassword)

    const result = await UserService.create(user)

    //return jsonwebtoken

    //res.send('user created').json(user)

    const token = jwt.sign(
      { email: result.email, id: result._id },
      'JWT_SECRET',
      {
        expiresIn: 60 * 60,
      },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (error) {
    console.log('Error happened')
    res.status(500).send('Server Error')
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
