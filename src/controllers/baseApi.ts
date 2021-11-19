
import { NextFunction } from 'express'
import { BadRequestError } from './../helpers/apiError'
export const apiBaseRequest = async (
    next: NextFunction,
    callbackFunction: () => Promise<void>
  ) => {
    try {
        await callbackFunction;
    } catch (error) {
      if (error instanceof Error && error.name == 'ValidationError') {
        next(new BadRequestError('Invalid Request', error))
      } else {
        next(error)
      }
    }
  }