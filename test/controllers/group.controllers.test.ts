import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { logger } from '../../src/utils/logger';
import { DB_ERROR_NAME, EXTERNAL_ERROR_MESSAGE, INCOMING_REQUEST_MESSAGE } from '../../src/constants';
import groupService from '../../src/services/group.service';
import { Permission } from '../../src/types';

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('uuid', () => ({ v4: () => '1' }));

describe('group controller', () => {
  const spyVerify = jest.spyOn(jwt, 'verify');

  beforeAll(() => {
    spyVerify.mockImplementation(() => () => 'decoded');
  });

  afterAll(() => {
    spyVerify.mockRestore();
  });

  const mockGroup = { name: 'Test Group', permissions: [Permission.WRITE] };

  describe('POST /groups', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest
        .spyOn(groupService, 'createGroup')
        .mockImplementation(() => Promise.resolve({ id: '1', ...mockGroup }) as any);

      await request(app)
        .post('/groups')
        .set('Authorization', 'Bearer: 1234')
        .send(mockGroup)
        .expect(200, JSON.stringify('Group with id 1 has been created'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'POST',
          payload: mockGroup,
          query: {},
        },
      });
      spy.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(groupService, 'createGroup')
        .mockImplementation(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).post('/groups').set('Authorization', 'Bearer: 1234').send(mockGroup).expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'createGroup',
          payload: mockGroup,
          query: {},
        },
      });
      spy.mockRestore();
    });
  });

  describe('GET /groups', () => {
    it('should return 200 if data is valid', async () => {
      const mockResponse = [{ id: '1', ...mockGroup }];
      const spy = jest.spyOn(groupService, 'getGroups').mockImplementation(() => Promise.resolve(mockResponse) as any);

      await request(app).get('/groups').set('Authorization', 'Bearer: 1234').expect(200, mockResponse);
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
        .spyOn(groupService, 'getGroups')
        .mockImplementation(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).get('/groups').set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'getGroups',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
    });
  });

  describe('GET /groups/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spy = jest
        .spyOn(groupService, 'getGroupById')
        .mockImplementation(() => Promise.resolve({ ...mockGroup, id: 1 }) as any);

      await request(app)
        .get('/groups/1')
        .set('Authorization', 'Bearer: 1234')
        .expect(200, { ...mockGroup, id: 1 });
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
        .spyOn(groupService, 'getGroupById')
        .mockImplementationOnce(() => Promise.resolve({ ...mockGroup, id: 1 }) as any)
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).get('/groups/1').set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'getGroup',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
    });
  });

  describe('PUT /groups/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spyGetGroupById = jest
        .spyOn(groupService, 'getGroupById')
        .mockImplementation(() => Promise.resolve({ ...mockGroup, id: 1 }) as any);
      const spy = jest.spyOn(groupService, 'updateGroup').mockImplementation(() => Promise.resolve());

      await request(app)
        .put('/groups/1')
        .send(mockGroup)
        .set('Authorization', 'Bearer: 1234')
        .expect(200, JSON.stringify('Group with id 1 has been updated'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'PUT',
          payload: mockGroup,
          query: {},
        },
      });
      spy.mockRestore();
      spyGetGroupById.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spyGetGroupById = jest
        .spyOn(groupService, 'getGroupById')
        .mockImplementation(() => Promise.resolve({ ...mockGroup, id: 1 }) as any);
      const spy = jest
        .spyOn(groupService, 'updateGroup')
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).put('/groups/1').send(mockGroup).set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'updateGroup',
          payload: mockGroup,
          query: {},
        },
      });
      spy.mockRestore();
      spyGetGroupById.mockRestore();
    });
  });

  describe('DELETE /groups/:id', () => {
    it('should return 200 if data is valid', async () => {
      const spyGetUserById = jest
        .spyOn(groupService, 'getGroupById')
        .mockImplementation(() => Promise.resolve({ ...mockGroup, id: 1 }) as any);
      const spy = jest.spyOn(groupService, 'deleteGroup').mockImplementation(() => Promise.resolve());

      await request(app)
        .delete('/groups/1')
        .set('Authorization', 'Bearer: 1234')
        .expect(200, JSON.stringify('Group with id 1 has been removed'));
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
      const spyGetUserById = jest
        .spyOn(groupService, 'getGroupById')
        .mockImplementation(() => Promise.resolve({ ...mockGroup, id: 1 }) as any);
      const spy = jest
        .spyOn(groupService, 'deleteGroup')
        .mockImplementationOnce(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).delete('/groups/1').set('Authorization', 'Bearer: 1234').expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'deleteGroup',
          payload: {},
          query: {},
        },
      });
      spy.mockRestore();
      spyGetUserById.mockRestore();
    });
  });

  describe('POST /addUsersToGroup', () => {
    const mockPayload = { groupId: 1, userIds: [1, 2, 3] };

    it('should return 200 if data is valid', async () => {
      const spy = jest.spyOn(groupService, 'addUsersToGroup').mockImplementation(() => Promise.resolve() as any);

      await request(app)
        .post('/addUsersToGroup')
        .set('Authorization', 'Bearer: 1234')
        .send(mockPayload)
        .expect(200, JSON.stringify('Success'));
      expect(logger.info).toHaveBeenCalledWith({
        message: INCOMING_REQUEST_MESSAGE,
        details: {
          method: 'POST',
          payload: mockPayload,
          query: {},
        },
      });
      spy.mockRestore();
    });

    it('should return 500 if any errors', async () => {
      const spy = jest
        .spyOn(groupService, 'addUsersToGroup')
        .mockImplementation(() => Promise.reject({ name: DB_ERROR_NAME }) as any);

      await request(app).post('/addUsersToGroup').set('Authorization', 'Bearer: 1234').send(mockPayload).expect(500);
      expect(logger.error).toHaveBeenCalledWith({
        message: EXTERNAL_ERROR_MESSAGE,
        details: {
          method: 'addUsersToGroup',
          payload: mockPayload,
          query: {},
        },
      });
      spy.mockRestore();
    });
  });
});
