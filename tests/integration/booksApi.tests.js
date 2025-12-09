import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { connectDb, disconnectDb } from '../../src/config/db.js';
import { Author } from '../../src/models/author.model.js';
import { Book } from '../../src/models/book.model.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDb(uri);
});

afterAll(async () => {
  await disconnectDb();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  await Promise.all([Book.deleteMany({}), Author.deleteMany({})]);
});

describe('Books API', () => {
  it('creates and retrieves a book', async () => {
    const author = await Author.create({ name: 'Test Author' });

    const createRes = await request(app)
      .post('/books')
      .send({
        title: 'Integration Test Book',
        description: 'A test book',
        author: author._id.toString(),
        genres: ['Fantasy'],
        publishedYear: 2020
      })
      .expect(201);

    const id = createRes.body._id;

    const listRes = await request(app)
      .get('/books')
      .query({ q: 'Integration', limit: 5, page: 1 })
      .expect(200);

    expect(listRes.body.items.length).toBeGreaterThanOrEqual(1);

    const getRes = await request(app)
      .get(`/books/${id}`)
      .expect(200);

    expect(getRes.body.title).toBe('Integration Test Book');
  });
});