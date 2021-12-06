import passport from 'passport'
import passportLocal from 'passport-local'
import userService from '../services/user'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'
//import { Request, Response, NextFunction } from 'express'
//import GoogleTokenStrategy from 'passport-google-id-token'
//import { JWT_SECRET } from '../util/secrets'

const GoogleTokenStrategy = require('passport-google-id-token')

const LocalStrategy = passportLocal.Strategy

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },

  async function (parsedToken: any, googleId: string, done: any) {
    console.log('from backEnd', parsedToken)
    //Sending to db
    const userPayload = {
      email: parsedToken?.payload?.email,
      firstName: parsedToken?.payload?.given_name,
      lastName: parsedToken?.payload?.family_name,
    }
    try {
      const user = await userService.findOrCreate(userPayload)
      done(null, user)
    } catch (e) {
      done(e)
    }
  }
)

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: any, done: any) => {
    console.log('Hello-----From JWT Strategy')
    const userEmail = payload.email
    const foundUser = await userService.findUserByEmail(userEmail)
    done(null, foundUser)
  }
)
