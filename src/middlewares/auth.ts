import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../helpers/apiError'

//auth middleware
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  //get token from header
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      if (token) {
        jwt.verify(token, 'JWT_SECRET', (error, decoded) => {
          if (error) {
            return res.status(404).json({ message: error.message, error })
          } else {
            res.locals.jwt = decoded
            next()
          }
        })
      } else {
        return res.status(401).json({ message: 'Unauthorized' })
      }
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
}
export default auth
