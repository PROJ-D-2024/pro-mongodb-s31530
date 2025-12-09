import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { User } from '../src/models/user.model.js';
import { Author } from '../src/models/author.model.js';
import { Book } from '../src/models/book.model.js';
import { Review } from '../src/models/review.model.js';

dotenv.config();

const genres = [
  'Fantasy',
  'Science Fiction',
  'Romance',
  'Mystery',
  'Non-fiction',
  'Horror',
  'Historical',
  'Thriller'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date;
}

async function run() {
  try {
    await connectDb(process.env.MONGODB_URI);

    await Promise.all([
      User.deleteMany({}),
      Author.deleteMany({}),
      Book.deleteMany({}),
      Review.deleteMany({})
    ]);

    const users = [];
    for (let i = 0; i < 60; i += 1) {
      users.push({
        email: `user${i}@example.com`,
        name: `User ${i}`,
        role: i === 0 ? 'admin' : 'reader'
      });
    }
    const createdUsers = await User.insertMany(users);

    const authors = [];
    for (let i = 0; i < 40; i += 1) {
      authors.push({
        name: `Author ${i}`,
        bio: `Short bio for Author ${i}.`
      });
    }
    const createdAuthors = await Author.insertMany(authors);

    const books = [];
    for (let i = 0; i < 120; i += 1) {
      const author = randomItem(createdAuthors);
      const year = randomInt(1950, 2024);
      const bookGenres = Array.from(
        new Set([
          randomItem(genres),
          randomItem(genres),
          randomItem(genres)
        ])
      ).slice(0, randomInt(1, 3));

      books.push({
        title: `Book Title ${i}`,
        description: `Description for Book ${i}.`,
        author: author._id,
        genres: bookGenres,
        publishedYear: year
      });
    }
    const createdBooks = await Book.insertMany(books);

    const reviews = [];
    for (let i = 0; i < 400; i += 1) {
      const book = randomItem(createdBooks);
      const user = randomItem(createdUsers);
      reviews.push({
        book: book._id,
        user: user._id,
        rating: randomInt(1, 5),
        comment: `Review ${i} for ${book.title}`,
        createdAt: randomPastDate(365),
        updatedAt: randomPastDate(365)
      });
    }
    await Review.insertMany(reviews);

    const bookIds = createdBooks.map(b => b._id);
    for (const bookId of bookIds) {
      await Review.recalculateBookRating(bookId);
    }

    console.log('Seed completed');
  } catch (err) {
    console.error('Seed failed', err);
  } finally {
    await disconnectDb();
  }
}

run();