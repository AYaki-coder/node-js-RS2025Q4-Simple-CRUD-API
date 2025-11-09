import request from 'supertest';
import { expect, describe, it } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';

import { API_LINK, SUPPORTED_ROUTE } from '../src/constants';
import { createdUser, invalidUsersCase, updatedUser } from './users.test.data';
import { User } from '../src/user';

dotenv.config({
  path: path.join(__dirname, './../.env'),
});

const host = process.env.PORT ? `localhost:${process.env.PORT}` : 'localhost:5000';
const routeUser = `/${API_LINK}/${SUPPORTED_ROUTE}`;
console.log('HOST', host);
const req = request(host);

describe('E2E User API Workflow SCENARIO 1', () => {
  let createdUserId: string;

  it('should get all users, create a user, retrieve it, update it, then delete it and try to retrieve it again (with not found)  in a single flow', async () => {
    const getAllResponse = await req
      .get(routeUser)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(getAllResponse.status).toEqual(200);
    expect(Array.isArray(getAllResponse.body)).toBeTruthy();

    const createResponse = await req
      .post(routeUser)
      .set('Accept', 'application/json')
      .send(createdUser)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(createResponse.body).toHaveProperty('id');
    expect(typeof createResponse.body.id).toBe('string');

    expect(createResponse.body.username).toBe(createdUser.username);
    expect(createResponse.body.age).toBe(createdUser.age);
    expect(createResponse.body.hobbies).toStrictEqual(createdUser.hobbies);

    createdUserId = createResponse.body.id;

    const getResponse = await req
      .get(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(getResponse.body.id).toBe(createdUserId);
    expect(getResponse.body.username).toBe(createdUser.username);
    expect(getResponse.body.age).toBe(createdUser.age);
    expect(getResponse.body.hobbies).toStrictEqual(createdUser.hobbies);

    const putResponse = await req
      .put(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(putResponse.body.id).toBe(createdUserId);
    expect(putResponse.body.username).toBe(updatedUser.username);
    expect(putResponse.body.age).toBe(updatedUser.age);
    expect(putResponse.body.hobbies).toStrictEqual(updatedUser.hobbies);

    await req
      .delete(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .expect(204);

    await req
      .get(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/);
  });
});

describe('E2E SCENARIO 2:should prevent bad data from entering the system and returning appropriate HTTP error code by attempting to create or update a user with invalid data, should not delete non-existent user', () => {
  let allUsers: User[];
  let createdUserId: string;

  beforeEach(async () => {
    allUsers = (await req.get(routeUser)).body;
  });

  it.each(invalidUsersCase)('should not create user $should and answer with code 400', async ({ body }) => {
    await req
      .post(routeUser)
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .expect('Content-Type', /json/);

    const getAllUsers = (await req.get(routeUser).set('Accept', 'application/json')).body;

    expect(getAllUsers).toStrictEqual(allUsers);
  });

  it('should create user with valid data', async () => {
    const createResponse = await req
      .post(routeUser)
      .set('Accept', 'application/json')
      .send(createdUser)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(createResponse.body).toHaveProperty('id');
    expect(typeof createResponse.body.id).toBe('string');

    expect(createResponse.body.username).toBe(createdUser.username);
    expect(createResponse.body.age).toBe(createdUser.age);
    expect(createResponse.body.hobbies).toStrictEqual(createdUser.hobbies);

    createdUserId = createResponse.body.id;
  });

  it.each(invalidUsersCase)('should not update user $should and answer with code 400', async ({ body }) => {
    await req
      .put(`${routeUser}/${createdUserId}`)
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .expect('Content-Type', /json/);

    const getAllUsers = (await req.get(routeUser).set('Accept', 'application/json')).body;

    expect(getAllUsers).toStrictEqual(allUsers);
  });

  it('should not delete non-existent user', async () => {
    await req
      .delete(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .expect(204);

    const getAllUsers = (await req.get(routeUser).set('Accept', 'application/json')).body;
    await req
      .delete(routeUser + '/' + createdUserId)
      .set('Accept', 'application/json')
      .expect(404);

    const repeatGetAllUsers = (await req.get(routeUser).set('Accept', 'application/json')).body;

    expect(repeatGetAllUsers).toStrictEqual(getAllUsers);
  });
});

describe('E2E SCENARIO 3: should prevent working with invalid routes and id', () => {
  let allUsers: User[];

  beforeEach(async () => {
    allUsers = (await req.get(routeUser)).body;
  });

  it('should not allow access to incorrect api, route, and work with invalid id', async () => {
    await req.get('/qwerty').set('Accept', 'application/json').expect(404).expect('Content-Type', /json/);

    await req
      .get(`/${API_LINK}/some_not_supported_route`)
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/);

    await req
      .get(`${routeUser}/incorrect_id`)
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/);

    await req
      .put(`${routeUser}/incorrect_id`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .expect(400)
      .expect('Content-Type', /json/);

    await req
      .post(`${routeUser}/incorrect_id`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .expect(404)
      .expect('Content-Type', /json/);

    await req
      .delete(`${routeUser}/incorrect_id`)
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/);

    const getAllUsers = (await req.get(routeUser).set('Accept', 'application/json')).body;
    expect(getAllUsers).toStrictEqual(allUsers);
  });
});
