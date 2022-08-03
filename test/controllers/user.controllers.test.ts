import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { logger } from '../../src/utils/logger';
import { DB_ERROR_NAME, EXTERNAL_ERROR_MESSAGE, INCOMING_REQUEST_MESSAGE } from '../../src/constants';
import userService from '../../src/services/user.service';

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('uuid', () => ({ v4: () => '1' }));

describe('user controller', () => {
  const spyVerify = jest.spyOn(jwt, 'verify');

  beforeAll(() => {
    spyVerify.mockImplementation(() => () => 'decoded');
  });

  afterAll(() => {
    spyVerify.mockRestore();
  });

  const mockUser = { login: 'Test User 2', password: '12345', age: 26 };

  describe('POST /users', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest
        .spyOn(userService, 'createUser')
        .mockImplementation(() => Promise.resolve({ id: '1', ...mockUser }) as any);

      await request(app)
        .post('/users')
        .set('Authorization', 'Bearer: 1234')
        .send(mockUser)
        .expect(200, JSON.stringify('User with id 1 has been created'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'POST',
          payload: mockUser,
          query: {},
        },
      });
      spy.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(userService, 'createUser')
        .mockImplementation(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).post('/users').set('Authorization', 'Bearer: 1234').send(mockUser).expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'createUser',
          payload: mockUser,
          query: {},
        },
      });
      spy.mockRestore();
    });
  });

  describe('GET /users', () => {
    it('should return 200 if data is valid', async () => {
      const mockResponse = [{ id: '1', ...mockUser }];
      const spy = jest.spyOn(userService, 'getUsers').mockImplementation(() => Promise.resolve(mockResponse) as any);

      await request(app)
        .get('/users')
        .set('Authorization', 'Bearer: 1234')
        .query({ limit: 10 })
        .expect(200, mockResponse);
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'GET',
          payload: {},
          query: { limit: '10' },
        },
      });
      spy.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(userService, 'getUsers')
        .mockImplementation(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).get('/users').set('Authorization', 'Bearer: 1234').query({ limit: 10 }).expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'getUsers',
          payload: {},
          query: { limit: '10' },
        },
      });
      spy.mockRestore();
    });
  });

  describe('GET /users/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest
        .spyOn(userService, 'getUserById')
        .mockImplementation(() => Promise.resolve({ ...mockUser, id: 1 }) as any);

      await request(app)
        .get('/users/1')
        .set('Authorization', 'Bearer: 1234')
        .expect(200, { ...mockUser, id: 1 });
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'GET',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(userService, 'getUserById')
        .mockImplementationOnce(() => Promise.resolve({ ...mockUser, id: 1 }) as any)
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).get('/users/1').set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'getUser',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
    });
  });

  describe('PUT /users/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest.spyOn(userService, 'updateUser').mockImplementation(() => Promise.resolve());
      const spyGetUserById = jest
        .spyOn(userService, 'getUserById')
        .mockImplementation(() => Promise.resolve({ ...mockUser, id: 1 }) as any);

      await request(app)
        .put('/users/1')
        .send(mockUser)
        .set('Authorization', 'Bearer: 1234')
        .expect(200, JSON.stringify('User with id 1 has been updated'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'PUT',
          payload: mockUser,
          query: {},
        },
      });
      spy.mockRestore();
      spyGetUserById.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(userService, 'updateUser')
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);
      const spyGetUserById = jest
        .spyOn(userService, 'getUserById')
        .mockImplementation(() => Promise.resolve({ ...mockUser, id: 1 }) as any);

      await request(app).put('/users/1').send(mockUser).set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'updateUser',
          payload: mockUser,
          query: {},
        },
      });
      spy.mockRestore();
      spyGetUserById.mockRestore();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest.spyOn(userService, 'deleteUser').mockImplementation(() => Promise.resolve());
      const spyGetUserById = jest
        .spyOn(userService, 'getUserById')
        .mockImplementation(() => Promise.resolve({ ...mockUser, id: 1 }) as any);

      await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer: 1234')
        .expect(200, JSON.stringify('User with id 1 has been removed'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'DELETE',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
      spyGetUserById.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(userService, 'deleteUser')
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);
      const spyGetUserById = jest
        .spyOn(userService, 'getUserById')
        .mockImplementation(() => Promise.resolve({ ...mockUser, id: 1 }) as any);

      await request(app).delete('/users/1').set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'deleteUser',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
      spyGetUserById.mockRestore();
    });
  });
});

describe('authorization', () => {
  it('should return 401 if token is not provided', async () => {
    await request(app).post('/users').send({ login: 'Test User 2', password: '12345', age: 26 }).expect(401);
  });

  it('should return 401 if token is invalid', async () => {
    await request(app)
      .post('/users')
      .set('Authorization', 'Bearer: 1234')
      .send({ login: 'Test User 2', password: '12345', age: 26 })
      .expect(403);
  });
});
