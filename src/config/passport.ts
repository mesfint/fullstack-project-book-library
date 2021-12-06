import passportLocal from 'passport-local'
import userService from '../services/user'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
//import { Request, Response, NextFunction } from 'express'
//import GoogleTokenStrategy from 'passport-google-id-token'
//import { JWT_SECRET } from '../util/secrets'

import GoogleTokenStrategy from 'passport-google-id-token'

const LocalStrategy = passportLocal.Strategy

export const googleStrategy = () =>
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
    },

    function (parsedToken: any, googleId: string, done: any) {
      //Sending to db
      const userPayload = {
        email: parsedToken?.payload?.email,
        firstName: parsedToken?.payload?.given_name,
        lastName: parsedToken?.payload?.family_name,
      }
      userService
        .findOrCreate(userPayload)
        .then((user: any) => done(null, user._id))
        .catch((error: any) => done(error))
    }
  )
export const jwtStrategy = () =>
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: any, done: any) => {
      console.log('Hello-----From JWT Strategy 2')
      const userEmail = payload.email
      const foundUser = await userService.findUserByEmail(userEmail)
      done(null, foundUser)
    }
  )
