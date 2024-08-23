import { type Request } from 'express'

import logger from '../config/logger'

import { getUserFromDB } from '../repository/user'

import type IUser from '../interfaces/models/user'

export const getUser = async (req: Request) => {
  const { id } = req.user as {
    id: number
  }

  logger.info(`id ${id}`)

  const user = getUserFromDB({
    where: {
      id
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      is_verified: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
      mobile: true
    }
  }) as IUser

  logger.info(user)

  return user
}
