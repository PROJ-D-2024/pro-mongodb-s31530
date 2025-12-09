import mongoose from 'mongoose';
import { Book } from '../../src/models/book.model.js';

describe('Book model validation', () => {
  it('requires a title', async () => {
    const book = new Book({
      description: 'No title',
      author: new mongoose.Types.ObjectId(),
      genres: ['Fantasy']
    });

    let error;
    try {
      await book.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('rejects invalid publishedYear', async () => {
    const book = new Book({
      title: 'Test',
      author: new mongoose.Types.ObjectId(),
      genres: ['Fantasy'],
      publishedYear: 1200
    });

    await expect(book.validate()).rejects.toBeDefined();
  });
});