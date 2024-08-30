import request from 'supertest'
import * as sinon from 'sinon'

import Application from '../../server/application'

import * as userRepository from '../../repository/user'
import * as bcryptHelper from '../../helpers/bcrypt'
import * as authHelper from '../../helpers/auth'

describe('POST /auth/login', () => {
  afterEach(async () => {
    sinon.restore()
  })

  it('should return 404 when user does not exists', async () => {
    sinon.stub(userRepository, 'getUserFromDB').resolves(null)

    const app = await Application()
    const response = await request(app).post('/auth/login').send({
      email: 'jdoe@yopmail.com',
      password: '12345'
    })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toStrictEqual({
      message: 'User does not exists.'
    })
  })

  it('should return 403 if user is not verified', async () => {
    sinon.stub(userRepository, 'getUserFromDB').resolves({
      id: 2,
      is_verified: false
    } as any)

    const app = await Application()
    const response = await request(app).post('/auth/login').send({
      email: 'jdoe@yopmail.com',
      password: '12345'
    })

    expect(response.statusCode).toEqual(403)
    expect(response.body).toStrictEqual({
      message: 'User not verified.'
    })
  })

  it('should return 403 if password is incorrect', async () => {
    sinon.stub(userRepository, 'getUserFromDB').resolves({
      id: 2,
      is_verified: true,
      password: '12345'
    } as any)

    const app = await Application()
    const response = await request(app).post('/auth/login').send({
      email: 'jdoe@yopmail.com',
      password: '1234'
    })

    expect(response.statusCode).toEqual(403)
    expect(response.body).toStrictEqual({
      message: 'Incorrect password.'
    })
  })

  it('should return 200 if password is incorrect', () => {
    sinon.stub(userRepository, 'getUserFromDB').resolves({
      id: 2,
      is_verified: true,
      password: '12345'
    } as any)
    sinon.stub(bcryptHelper, 'verifyPassword').resolves(true)
    sinon.stub(authHelper, 'generateToken').resolves('12345')

    async () => {
      const app = await Application()
      const response = await request(app).post('/auth/login').send({
        email: 'jdoe@yopmail.com',
        password: '12345'
      })

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({
        token: '12345'
      })
    }
  })
})
